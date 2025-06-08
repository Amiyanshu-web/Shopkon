import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
import os
import cohere
from dotenv import load_dotenv
import re

load_dotenv()

COHERE_API_KEY = os.getenv("CO_API_KEY")
co = cohere.Client(COHERE_API_KEY)

MONGO_CLIENT = os.getenv("MONGO_URI")
client = MongoClient(MONGO_CLIENT)
db = client["shopkon"]
collection = db["products"]

def extracted_k_from_query(user_query):
        
        # Patterns to match quantity requests
    quantity_patterns = [
        r'show\s+me\s+(\d+)',
        r'give\s+me\s+(\d+)',
        r'find\s+(\d+)',
        r'get\s+(\d+)',
        r'(\d+)\s+(?:products?|items?|cameras?|lenses?)',
        r'top\s+(\d+)',
        r'first\s+(\d+)',
        r'best\s+(\d+)'
    ]
    
    query_lower = user_query.lower()
    
    for pattern in quantity_patterns:
        match = re.search(pattern, query_lower)
        if match:
            try:
                requested_qty = int(match.group(1))
                # Reasonable limits
                if 1 <= requested_qty <= 100:
                    return requested_qty
            except ValueError:
                continue
    
    return None 

def enhanced_user_query(user_query):
    enhance_prompt=f"""You are an expert photography advisor. A user is searching for camera equipment with this query: "{user_query}"
        Based on your expertise, expand this query to include relevant technical terms, specifications, and related concepts that would help find the right photography equipment. Focus on:
        1. Technical specifications that matter for the use case
        2. Alternative terms and synonyms
        3. Related equipment types
        4. Key features to look for

        Return an enhanced search query that includes the original intent plus relevant technical terms.
        Keep it concise but comprehensive.

        Enhanced query:"""
    
    try:
        response = co.generate(
            model="command-r-plus-08-2024",
            prompt=enhance_prompt,
            temperature=0.5,
            max_tokens=100
        )
        enhanced_query = response.generations[0].text.strip()
        return enhanced_query
    except Exception as e:
        print(f"Error generating enhanced query: {str(e)}")
        return user_query

def filter_products_rag(user_query, top_k, similarity_threshold=0.4):
    user_k = extracted_k_from_query(user_query)

    final_k = user_k if user_k is not None else top_k

    enhanced_query = enhanced_user_query(user_query)

    query_embedding = co.embed(
            texts=[enhanced_query],
            model="embed-english-v3.0",
            input_type="search_query",
            embedding_types=["float"]
        )
    
    if query_embedding is None or not hasattr(query_embedding, 'embeddings') or not hasattr(query_embedding.embeddings, 'float'):
        print("Error generating query embedding")
        return [], 0

    query_vector = np.array(query_embedding.embeddings.float[0])

    products = list(collection.find({"embedding": {"$exists": True}}))
    # print(products[0]["embedding"])

    if not products:
        print("No products found with embeddings")
        return [], 0
    scored_products = []
    for product in products:
        try:
            product_vector = np.array(product["embedding"])
            similarity = cosine_similarity(query_vector.reshape(1,-1), product_vector.reshape(1,-1))[0][0]

            if similarity >= similarity_threshold:
                product.pop("embedding", None)
                product.pop("createdAt", None)
                product.pop("updatedAt", None)
                product.pop("__v", None)
                product["_id"] = str(product["_id"])
                if "user" in product:
                    product["user"] = str(product["user"])
                scored_products.append((similarity,product))
        except Exception as e:
            print(f"Error processing product {product['_id']}: {str(e)}")
            continue
    scored_products.sort(reverse=True, key=lambda x: x[0])
    final_products = [product for score, product in scored_products[:final_k]]
    
    return final_products, len(final_products)