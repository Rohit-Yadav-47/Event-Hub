from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer

import logging
import os
import re
import json
from groq import Groq  # Ensure this is the correct import for your Groq client

from events import EVENTS, USERS, COMMUNITIES  # Import data arrays

from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
# (Assuming environment variables are managed appropriately elsewhere)

app = FastAPI()

# Enable CORS (Adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client directly with API key
client = Groq(api_key="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")

# Initialize SentenceTransformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Pydantic Models
class Event(BaseModel):
    id: int
    name: str
    location: str
    type: str
    date: str  # Expecting format YYYY-MM-DD
    day: str  # Derived from date
    time: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class User(BaseModel):
    id: int
    username: str
    email: EmailStr
    interests: List[str]
    community_ids: List[int]

class Community(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    interests: List[str]

# Helper Functions

def convert_data_to_string(entities: List[dict], entity_type: str) -> str:
    """
    Converts a list of entities into a single string representation.
    """
    if entity_type == "event":
        return "\n".join([
            f"Name: {e['name']}\nLocation: {e['location']}\nType: {e['type']}\nDate: {e['date']}\nTime: {e['time']}\nDescription: {e.get('description', '')}\n"
            for e in entities
        ])
    elif entity_type == "user":
        return "\n".join([
            f"Username: {u['username']}\nEmail: {u['email']}\nInterests: {', '.join(u['interests'])}\n"
            for u in entities
        ])
    elif entity_type == "community":
        return "\n".join([
            f"Name: {c['name']}\nDescription: {c.get('description', '')}\nInterests: {', '.join(c['interests'])}\n"
            for c in entities
        ])
    else:
        return ""

def chunk_text(text: str, chunk_size: int = 500) -> List[str]:
    """
    Breaks a large text string into smaller chunks without splitting words.
    """
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0

    for word in words:
        if current_length + len(word) + 1 > chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = len(word) + 1
        else:
            current_chunk.append(word)
            current_length += len(word) + 1

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

def rank_chunks(query: str, chunks: List[str], top_k: int = 20) -> List[str]:
    """
    Ranks text chunks based on their similarity to the query and returns the top_k chunks.
    """
    if not chunks:
        return []

    query_embedding = model.encode([query])[0]
    chunk_embeddings = model.encode(chunks)

    similarities = np.dot(chunk_embeddings, query_embedding) / (
        np.linalg.norm(chunk_embeddings, axis=1) * np.linalg.norm(query_embedding)
    )

    top_indices = similarities.argsort()[-top_k:][::-1]
    return [chunks[i] for i in top_indices]

def extract_json_array(text: str) -> List[dict]:
    """
    Extracts and parses the first JSON array found in the text.
    """
    try:
        # Regular expression to find JSON arrays
        json_array_pattern = re.compile(r'\[.*\]', re.DOTALL)
        match = json_array_pattern.search(text)
        if not match:
            raise ValueError("No JSON array found in the response.")

        json_str = match.group()

        # Parse the JSON
        data = json.loads(json_str)
        if isinstance(data, list):
            # Validate each item has required fields
            for item in data:
                if not isinstance(item, dict):
                    raise ValueError("Array contains non-object items")
            return data
        raise ValueError("Response is not a JSON array")
    except Exception as e:
        logger.error(f"JSON parsing error: {str(e)}\nText: {text}")
        return []

def get_day_from_date(date_str: str) -> str:
    """
    Derives the day of the week from a date string in YYYY-MM-DD format.
    """
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        return date_obj.strftime("%A")
    except ValueError:
        return ""

def get_entities_from_groq(query: str, entity_type: str) -> List[dict]:
    """
    Processes the query to find relevant entities using Groq's LLM.
    Steps:
    1. Convert entities to string.
    2. Chunk the text.
    3. Rank and select top chunks.
    4. Send chunks to LLM with a specific prompt.
    5. Parse LLM's JSON response.
    """
    try:
        # Select dataset based on entity_type
        if entity_type == "event":
            dataset = EVENTS
        elif entity_type == "user":
            dataset = USERS
        elif entity_type == "community":
            dataset = COMMUNITIES
        else:
            dataset = []

        if not dataset:
            logger.warning(f"No dataset found for entity type: {entity_type}")
            return []

        # Convert data to string
        data_string = convert_data_to_string(dataset, entity_type)

        # Chunk the data
        chunks = chunk_text(data_string, chunk_size=500)

        # Rank and select top 5 chunks
        top_chunks = rank_chunks(query, chunks, top_k=5)

        # Combine top chunks into a single string
        top_data = "\n".join(top_chunks)

        # Customize prompt based on entity type
        if entity_type == "event":
            fields = ["id", "name", "location", "type", "date", "time", "description"]
        elif entity_type == "user":
            fields = ["id", "username", "email", "interests", "community_ids"]
        else:  # community
            fields = ["id", "name", "description", "interests"]

        prompt = (
            f"Based on the following data, find matching {entity_type}s for: '{query}'.\n\n"
            f"Data:\n{top_data}\n\n"
            f"Respond with ONLY a JSON array of the best matches. "
            f"Each object should have these fields: {', '.join(fields)}.\n"
            f"Do NOT include any additional text or explanations. "
            f"Format the response as a JSON array without any markdown or code blocks."
        )

        # Get LLM response
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a JSON-only response bot. Always respond with valid JSON arrays without any additional text."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
        )

        response_content = chat_completion.choices[0].message.content.strip()
        logger.info(f"Raw LLM Response for {entity_type}: {response_content}")

        # Parse LLM response
        matched_items = extract_json_array(response_content)
        if not matched_items:
            logger.warning(f"No valid matches found in LLM response for {entity_type}")
            return []

        # Map parsed items back to full entities
        matched_entities = []
        for item in matched_items:
            if entity_type == "user":
                entity = next((e for e in dataset if e["username"].lower() == item.get("username", "").lower()), None)
            else:
                entity = next((e for e in dataset if e["name"].lower() == item.get("name", "").lower()), None)

            if entity:
                matched_entities.append(entity)

        return matched_entities

    except Exception as e:
        logger.error(f"Error in get_entities_from_groq: {str(e)}")
        return []

def format_entities_for_frontend(entities: List[dict], entity_type: str) -> List[dict]:
    """
    Formats the entities into a structure suitable for frontend card rendering.
    """
    formatted = []
    for entity in entities:
        if entity_type == "event":
            # Derive the day from the date
            day = get_day_from_date(entity["date"])
            formatted.append({
                "id": entity["id"],
                "name": entity["name"],
                "location": entity["location"],
                "type": entity["type"],
                "date": entity["date"],
                "day": day,
                "time": entity["time"],
                "description": entity.get("description", "No description available."),
                "image_url": entity.get("image_url", "https://via.placeholder.com/150"),
            })
        elif entity_type == "user":
            formatted.append({
                "id": entity["id"],
                "username": entity["username"],
                "email": entity["email"],
                "interests": entity["interests"],
                "community_ids": entity["community_ids"],
            })
        elif entity_type == "community":
            formatted.append({
                "id": entity["id"],
                "name": entity["name"],
                "description": entity.get("description", "No description available."),
                "interests": entity["interests"],
            })
    return formatted

def format_community_response(communities: List[dict], query: str) -> dict:
    """Format community response for frontend."""
    if not communities:
        return {
            "response": "No matching communities found. Try different interests or keywords.",
            "communities": []
        }
    
    formatted_communities = []
    for community in communities:
        formatted_communities.append({
            "id": community["id"],
            "name": community["name"],
            "description": community.get("description", "No description available"),
            "interests": community.get("interests", []),
            "member_count": len(community.get("members", [])), # Add member count
            "image_url": community.get("image_url", "https://via.placeholder.com/400x200")
        })
    
    response_text = (
        f"Found {len(communities)} communities matching your interests. "
        f"Top matches include {', '.join(c['name'] for c in communities[:3])}."
    )
    
    return {
        "response": response_text,
        "communities": formatted_communities
    }

def format_user_response(user: dict, include_related: bool = False) -> dict:
    """Format user response with optional related data."""
    response = {
        "id": user["id"],
        "username": user["username"],
        "email": user["email"],
        "interests": user["interests"],
        "community_ids": user["community_ids"],
        "avatar": f"https://picsum.photos/400/400/?random={user['id']}", # Random avatar
        "about": f"User profile for {user['username']} with interests in {', '.join(user['interests'][:3])}..."
    }
    
    if include_related:
        # Get related communities based on user's interests
        related_communities = [
            c for c in COMMUNITIES 
            if any(interest in c["interests"] for interest in user["interests"])
        ][:5]
        
        response["related_communities"] = [
            {
                "id": c["id"],
                "name": c["name"],
                "description": c["description"],
                "interests": c["interests"],
                "image_url": f"https://picsum.photos/400/200/?random={c['id']}"
            }
            for c in related_communities
        ]
    
    return response

# Existing Endpoints

@app.post("/chatbot")
async def chatbot_endpoint(request: Request):
    """
    Endpoint to handle event-related queries.
    """
    try:
        data = await request.json()
        query = data.get("query", "").strip()

        if not query:
            raise HTTPException(status_code=400, detail="Query cannot be empty")

        entity_type = "event"

        # Get matched events using LLM
        matched_events = get_entities_from_groq(query, entity_type)

        if not matched_events:
            return JSONResponse({
                "response": "I couldn't find any events matching your criteria. Would you like to try a different search?",
                "events": []
            })

        # Format events for frontend
        formatted_events = format_entities_for_frontend(matched_events, entity_type)

        response = {
            "response": f"Here are the events that suit's you according to your preferences: {', '.join([e['name'] for e in matched_events])}",
            "events": formatted_events
        }

        return JSONResponse(response)

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in chatbot_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error.")

@app.post("/chat")
async def chat_endpoint(request: Request):
    """
    General chat endpoint for other interactions.
    """
    try:
        data = await request.json()
        user_message = data.get("message", "").strip()

        if not user_message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": user_message,
                }
            ],
            model="llama-3.3-70b-versatile",  # Replace with your actual model name
            stream=False,
        )
        response_content = chat_completion.choices[0].message.content.strip()

        return JSONResponse({"response": response_content})

    except Exception as e:
        logger.error(f"Error in chat_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error.")

@app.get("/events", response_model=List[Event])
async def get_events(skip: int = 0, limit: int = 100):
    """
    Retrieve a paginated list of events.
    """
    return [Event(**e, day=get_day_from_date(e["date"])) for e in EVENTS[skip : skip + limit]]

@app.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: int):
    """
    Retrieve a specific event by its ID.
    """
    event = next((e for e in EVENTS if e["id"] == event_id), None)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return Event(**event, day=get_day_from_date(event["date"]))

# New Endpoints for Users

@app.get("/users", response_model=List[User])
async def get_users_endpoint(skip: int = 0, limit: int = 100):
    """
    Retrieve a paginated list of users.
    """
    return [User(**u) for u in USERS[skip : skip + limit]]

@app.get("/users/{user_id}", response_model=None)
async def get_user_endpoint(user_id: int):
    """Get basic user profile."""
    user = next((u for u in USERS if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return format_user_response(user)

@app.get("/users/{user_id}/full")
async def get_user_full_profile(user_id: int):
    """Get complete user profile including related data."""
    user = next((u for u in USERS if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return format_user_response(user, include_related=True)

@app.post("/match/users")
async def match_users_endpoint(request: Request):
    """
    Endpoint to handle user-related queries.
    """
    try:
        data = await request.json()
        query = data.get("query", "").strip()

        if not query:
            raise HTTPException(status_code=400, detail="Query cannot be empty")

        entity_type = "user"

        # Get matched users using LLM
        matched_users = get_entities_from_groq(query, entity_type)

        if not matched_users:
            return JSONResponse({
                "response": "I couldn't find any users matching your criteria. Would you like to try a different search?",
                "users": []
            })

        # Format users for frontend
        formatted_users = format_entities_for_frontend(matched_users, entity_type)

        response = {
            "response": f"Here are the users that match your query: {', '.join([u['username'] for u in matched_users])}",
            "users": formatted_users
        }

        return JSONResponse(response)

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in match_users_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error.")

@app.post("/users/match")
async def match_users(request: Request):
    """Enhanced user matching endpoint."""
    try:
        data = await request.json()
        query = data.get("query", "").strip()
        user_id = data.get("user_id")  # Optional: to exclude current user
        
        if not query:
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        # Get matched users using LLM
        matched_users = get_entities_from_groq(query, "user")
        
        # Remove current user if user_id provided
        if user_id:
            matched_users = [u for u in matched_users if u["id"] != user_id]
        
        # Format response
        formatted_users = [format_user_response(u) for u in matched_users[:10]]
        
        response = {
            "users": formatted_users,
            "total": len(matched_users),
            "message": f"Found {len(matched_users)} users matching your interests"
        }
        
        return JSONResponse(response)
        
    except Exception as e:
        logger.error(f"Error in match_users: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# New Endpoints for Communities

@app.get("/communities", response_model=List[Community])
async def get_communities_endpoint(skip: int = 0, limit: int = 100):
    """
    Retrieve a paginated list of communities.
    """
    return [Community(**c) for c in COMMUNITIES[skip : skip + limit]]

@app.get("/communities/{community_id}", response_model=Community)
async def get_community_endpoint(community_id: int):
    """
    Retrieve a specific community by its ID.
    """
    community = next((c for c in COMMUNITIES if c["id"] == community_id), None)
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    return Community(**community)

@app.post("/match/communities")
async def match_communities_endpoint(request: Request):
    """Enhanced endpoint to handle community matching."""
    try:
        data = await request.json()
        query = data.get("query", "").strip()

        if not query:
            return JSONResponse({
                "response": "Please provide some interests or keywords to find matching communities.",
                "communities": []
            })

        # Get matched communities using LLM
        matched_communities = get_entities_from_groq(query, "community")
        
        # Format response for frontend
        response = format_community_response(matched_communities, query)
        return JSONResponse(response)

    except Exception as e:
        logger.error(f"Error in match_communities_endpoint: {str(e)}")
        return JSONResponse(
            {
                "response": "An error occurred while finding matching communities. Please try again.",
                "communities": [],
                "error": str(e)
            },
            status_code=500
        )

# Optional: Health Check Endpoint

@app.get("/health")
async def health_check():
    return {"status": "API is running smoothly!"}
