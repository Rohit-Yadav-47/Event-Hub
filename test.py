import requests

url = "http://127.0.0.1:8000/chatbot"

data = {
    "query": "can u say some hackathons",
   
}

response = requests.post(url, json=data)

if response.status_code == 200:
    data = response.json()
    print(data["response"])
    print(data["top_related_chunks"])
else:
    print(f"Error: {response.status_code} - {response.text}")