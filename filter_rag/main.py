from flask import Flask, request, jsonify
# from .productFilter import filter_products
# from .productRag import rag_answer
# from .productQuery import filter_products_rag
from .productLLM import llm_answer
from .productQuery import filter_products_rag
import os
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
PORT = int(os.environ.get("FILTER_PORT", 5001))

app = Flask(__name__)
CORS(app, resources={r"/filter_rag": {"origins": ["http://localhost:5000", os.getenv("REACT_APP_PROXY")]}})

@app.route('/filter_rag', methods=['POST'])
def filter_endpoint():
    data = request.get_json()
    query = data.get('query')
    top_k = 80
    # model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')   

    # 1. Search for similar products by embedding + cosine similarity
    # matched_products, total_count = filter_products(query, top_k)
    matched_products, total_count = filter_products_rag(query, top_k)

    if matched_products:
        # print(matched_products)
        # Return matched products with pagination info
        return jsonify({
            'status': 'matched',
            'products': matched_products,
            'totalCount': total_count,
            'answer': 'Filtered similar products based on your query!'
        })

    # 2. If no match found, generate RAG answer for the query
    rag_ans = llm_answer(query)

    return jsonify({
        'status': 'rag',
        'answer': rag_ans
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Filter RAG service is running'}), 200


if __name__ == "__main__":
    app.run(port=PORT, host="0.0.0.0")