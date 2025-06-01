import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
# from sentence_transformers import SentenceTransformer
from pymongo import MongoClient
import os
import re
from dotenv import load_dotenv
load_dotenv()

MONGO_CLIENT = os.getenv("MONGO_CLIENT")
# print(MONGO_CLIENT)
client = MongoClient(MONGO_CLIENT)
db = client["shopkon"]
collection = db["products"]

# model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def extract_filters_from_query(user_query):
    filters = {}
    query_lower = user_query.lower()
    
    # Price filters
    price_patterns = [
        (r'price\s*(?:less than|under|below)\s*\$?(\d+)', 'price_max'),
        (r'price\s*(?:more than|over|above)\s*\$?(\d+)', 'price_min'),
        (r'under\s*\$?(\d+)', 'price_max'),
        (r'below\s*\$?(\d+)', 'price_max'),
        (r'over\s*\$?(\d+)', 'price_min'),
        (r'above\s*\$?(\d+)', 'price_min'),
        (r'\$(\d+)\s*(?:or\s*)?(?:less|under)', 'price_max'),
        (r'cheaper\s*than\s*\$?(\d+)', 'price_max'),
        (r'costlier\s*than\s*\$?(\d+)', 'price_min'),
    ]
    
    for pattern, filter_type in price_patterns:
        match = re.search(pattern, query_lower)
        if match:
            price_value = float(match.group(1))
            filters[filter_type] = price_value
            break
    
    # Category/Product type filters (search in product names)
    product_type_keywords = {
        'mirrorless': ['mirrorless'],
        'dslr': ['dslr'],
    }
    
    for product_type, keywords in product_type_keywords.items():
        if any(keyword in query_lower for keyword in keywords):
            filters['product_type'] = product_type
            break
    
    # Brand filters (add common brands as needed)
    brand_keywords = ['canon', 'nikon', 'sony', 'fujifilm', 'pentax','panasonic', 'lg', 'olympus']
    for brand in brand_keywords:
        if brand in query_lower:
            filters['brand'] = brand
            break
    
    # Rating filters
    rating_pattern = r'rating\s*(?:above|over|more than)\s*(\d+(?:\.\d+)?)'
    rating_match = re.search(rating_pattern, query_lower)
    if rating_match:
        filters['rating_min'] = float(rating_match.group(1))
    
    # Available/in stock filters
    if any(word in query_lower for word in ['available', 'in stock', 'stock']):
        filters['in_stock'] = True
    
    return filters

def build_mongo_query(filters):
    mongo_query = {"embedding": {"$exists": True}}
    
    if 'price_min' in filters and 'price_max' in filters:
        mongo_query['price'] = {"$gte": filters['price_min'], "$lte": filters['price_max']}
    elif 'price_min' in filters:
        mongo_query['price'] = {"$gte": filters['price_min']}
    elif 'price_max' in filters:
        mongo_query['price'] = {"$lte": filters['price_max']}
    
    if 'category' in filters:
        mongo_query['category'] = {"$regex": filters['category'], "$options": "i"}
    
    if 'product_type' in filters:
        mongo_query['name'] = {"$regex": filters['product_type'], "$options": "i"}
    
    if 'brand' in filters:
        mongo_query['brand'] = {"$regex": filters['brand'], "$options": "i"}
    
    if 'rating_min' in filters:
        mongo_query['rating'] = {"$gte": filters['rating_min']}
    
    if 'in_stock' in filters:
        mongo_query['countInStock'] = {"$gt": 0}
    
    return mongo_query

def clean_query_for_semantic_search(user_query, filters):
    """Remove filter-related words from query for better semantic search"""
    query_lower = user_query.lower()
    
    # Remove price-related terms
    price_terms = ['price', 'under', 'over', 'below', 'above', 'less than', 'more than', 
                   'cheaper', 'costlier', r'\$\d+']
    
    # Remove category terms that were detected
    if 'product_type' in filters:
        product_type_terms = ['mirrorless', 'dslr','camera', 'lens','product']
        price_terms.extend(product_type_terms)
    
    # Remove other filter terms
    filter_terms = ['available', 'in stock', 'rating above', 'rating over']
    price_terms.extend(filter_terms)
    
    # cleaned_query = user_query
    cleaned_query = query_lower
    for term in price_terms:
        cleaned_query = re.sub(rf'\b{term}\b', '', cleaned_query, flags=re.IGNORECASE)
    
    # Clean up extra spaces
    cleaned_query = ' '.join(cleaned_query.split())
    
    return cleaned_query.strip()

def is_camera_related_query(user_query):
    
    camera_keywords = [
        # Camera types
        'camera', 'dslr', 'mirrorless', 'point and shoot', 'instant camera',
        
        # Lens types
        'lens', 'lenses', 'prime lens', 'zoom lens', 'macro lens', 'telephoto',
        'wide angle', 'fisheye', 'portrait lens', '50mm', '85mm', '24-70',
        
        # Camera features
        'megapixel', 'sensor', 'autofocus', 'image stabilization', 'viewfinder',
        'lcd screen', 'iso', 'aperture', 'shutter speed', 'exposure',
        
        # Photography terms
        'photography', 'photo', 'picture', 'shoot', 'portrait', 'landscape',
        'macro', 'wildlife', 'street photography', 'wedding photography',
        
        # Shopping intent for cameras
        'buy camera', 'camera for', 'best camera', 'camera under', 'camera price',
        'camera review', 'camera comparison', 'recommend camera',

        'product', 'item', 'show', 'find', 'get', 'all', 'available'
    ]
    
    query_lower = user_query.lower()
    
    # Check for camera keywords
    keyword_matches = sum(1 for keyword in camera_keywords if keyword in query_lower)
    
    camera_question_patterns = [
   r'\bwhat.*(?:camera|product|item)\b',
   r'\bwhich.*(?:camera|product|item)\b', 
   r'\bbest.*(?:camera|lens|photography|product|item)\b',
   r'\bcamera.*(?:for|under|price|review)\b',
   r'\blens.*(?:for|camera|photography)\b',
   r'\bshow.*(?:camera|lens|product|item|all)\b',
   r'\bfind.*(?:camera|lens|product|item)\b',
   r'\bproduct.*(?:for|under|price|review|available)\b',
   r'\bitem.*(?:for|under|price|review|available)\b',
   r'\b(?:show|find|get).*(?:me|all).*(?:product|item)\b',
   r'\b(?:what|which).*(?:product|item).*(?:do you have|available)\b',
   r'\ball.*(?:product|item|camera|lens)\b'
]
    
    pattern_matches = sum(1 for pattern in camera_question_patterns 
                         if re.search(pattern, query_lower))
    
    # Non-camera question patterns 
    non_camera_patterns = [
        r'\bwho\s+is\b',
        r'\bwhat\s+is\s+the\s+(?:capital|definition|meaning|weather)\b',
        r'\bhow\s+to\s+(?:learn|study|calculate|solve|cook|drive)\b',
        r'\bwhen\s+(?:was|did|is)\b.*(?:born|invented|discovered)\b',
        r'\bwhere\s+(?:is|was)\b.*(?:located|situated|born)\b',
        r'\bwhy\s+(?:is|was|do|does)\b.*(?:important|famous|popular)\b',
        r'\bfather\s+of\b',
        r'\bmother\s+of\b',
        r'\bhistory\s+of\b(?!.*(?:camera|photography))',  # Allow "history of camera"
        r'\b(?:explain|define|tell me about)\b.*(?:concept|theory|principle)\b'
    ]
    
    non_camera_matches = sum(1 for pattern in non_camera_patterns 
                            if re.search(pattern, query_lower))
    
    # Decision logic
    if non_camera_matches > 0:
        return False  # Clearly not a camera query
    
    if keyword_matches >= 1 or pattern_matches >= 1:
        return True  # Likely a camera query
    
    return False  # Default to not camera-related


def filter_products(user_query, model, top_k=80, similarity_threshold=0.5):
    """Enhanced product search with filtering and semantic similarity"""
    if not is_camera_related_query(user_query):
        return [], 0
    filters = extract_filters_from_query(user_query)
    
    if filters:
        mongo_query = build_mongo_query(filters)
        products = list(collection.find(mongo_query))
        
        final_products = products[:top_k]
    
    else:
        query_embedding = model.encode(user_query)
        products = list(collection.find({"embedding": {"$exists": True}}))
        
        scored = []
        for product in products:
            if "embedding" in product:
                similarity = cosine_similarity(
                    np.array(query_embedding).reshape(1, -1),
                    np.array(product["embedding"]).reshape(1, -1)
                )[0][0]
                
                if similarity >= similarity_threshold:
                    scored.append((similarity, product))
        
        scored.sort(reverse=True, key=lambda x: x[0])
        final_products = [product for score, product in scored[:top_k]]
    
        #Clean up the results
    for product in final_products:
        product.pop("embedding", None)
        product.pop("createdAt", None)
        product.pop("updatedAt", None)
        product.pop("__v", None)
        product["_id"] = str(product["_id"])
        if "user" in product:
            product["user"] = str(product["user"])
    
    return final_products, len(final_products)

# Example usage and test cases
# def test_queries():
#     """Test different types of queries"""
#     test_cases = [
#         # "Who is father of photography",
#         # "Show product with price less than 50000",
#         # "Mirrorless cameras under $50000",
#         # "DSLR with rating above 4",
#         # "Canon DSLR cameras",
#         "Show me mirrorless cameras",
#         "Smartphone under $300",
#         "Home appliances over $100",

        
#         # # Semantic queries (will use semantic search)
#         "Good camera for photography",
#         "Best laptop for gaming", 
#         "Affordable smartphone",
#         "Professional camera equipment"
#     ]
    
#     for query in test_cases:
#         print(f"\nQuery: {query}")
#         filters = extract_filters_from_query(query)
#         print(f"Extracted filters: {filters}")
#         mongo_query = build_mongo_query(filters)
#         print(f"MongoDB query: {mongo_query}")
#         semantic_query = clean_query_for_semantic_search(query, filters)
#         print(f"Semantic query: '{semantic_query}'")
#         products, itemCount = filter_products(query)
#         print(f"Filtered products: {itemCount} items found")
#         print("----------------------------------------------------------------\n")
    
#     # products, itemCount = filter_products("Who is father of photography")
#     # print(f"\nFiltered products: {itemCount} items found")
#     # if itemCount > 0:
#     #     print("Sample product:", products[0])

# # Uncomment to test
# test_queries()