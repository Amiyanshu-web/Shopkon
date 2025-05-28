from pymongo import MongoClient
import os
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

MONGO_URI = os.getenv("MONGO_URI")


client = MongoClient(MONGO_URI)
db = client["shopkon"]
collection = db["products"]

def getEmbeddings(text):
  try:
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    embeddings = model.encode(text)
    return embeddings
  except:
    print("Error embedding for ${text}")

def get_text_to_embed(document: dict, exclude_fields: list = None) -> str:
    if exclude_fields is None:
        exclude_fields = ['_id', 'user', 'embedding', 'createdAt', 'updatedAt','__v'] 
    
    text_parts = []
    for field, value in document.items():
        if field not in exclude_fields and isinstance(value, (str, int, float)):
            text_parts.append(str(value))
    
    return ' '.join(text_parts).strip()




def update_documents_with_embeddings():
    # Get total count for progress bar
    total_docs = collection.count_documents({"embedding": {"$exists": False}})
    
    print(f"Found {total_docs} documents to process")
    
    with tqdm(total=total_docs) as pbar:
        for doc in collection.find({"embedding": {"$exists": False}}):
            try:
                text_to_embed = get_text_to_embed(
                    doc,
                    exclude_fields=['_id', '__v'] 
                )
                # print(text_to_embed)
                
                if not text_to_embed:
                    print(f"Skipping document {doc['_id']} - no text to embed")
                    pbar.update(1)
                    continue
                
                # Generate embedding
                embedding = getEmbeddings(text_to_embed).tolist()
                # print(doc['_id'])
                # Update document
                collection.update_one(
                    {'_id': doc['_id']},
                    {'$set': {'embedding': embedding}}
                )
                # collection.find_one_and_update({'_id':doc['_id']},
                                                      # {'$set': {'embedding': embedding}})
                # print(test)
                pbar.update(1)
                    
            except Exception as e:
                print(f"Error processing document {doc.get('_id')}: {str(e)}")
                continue
    
    print("Embedding update complete")



if __name__ == "__main__":
    update_documents_with_embeddings()
    print("All documents processed")
    client.close()