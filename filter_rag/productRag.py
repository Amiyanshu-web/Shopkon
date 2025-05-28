import cohere
import os
from dotenv import load_dotenv
load_dotenv()

COHERE_API_KEY = os.getenv("CO_API_KEY")

co = cohere.Client(COHERE_API_KEY)

def rag_answer(user_query):

    prompt = f"""You are an assistant for question-answering tasks. 
            Only answer if the question is related to **camera** or **photography**.
            If it's not related, just say "I don't know." Keep the answer concise but frame answer in a human type format.

            Question: {user_query}
            Answer:"""

    response = co.generate(
        model="command-r-plus-08-2024",
        prompt=prompt,
        temperature=0.5,
        max_tokens=500
    )

    return response.generations[0].text.strip()