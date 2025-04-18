# Event Hub Platform

Event Hub is a modern event discovery and community engagement platform that helps users find events, connect with like-minded individuals, and join communities based on their interests.

https://hubevent.netlify.app/

As the backend is not live due to free limits attaching the screenshot for demo 

![image](https://github.com/user-attachments/assets/b38571fc-0d38-457e-9cef-b57bdd7e3526)
![image](https://github.com/user-attachments/assets/7568ed5c-ab58-4f3a-9977-b702a7451fa0)
![image](https://github.com/user-attachments/assets/51d752e0-2b7f-4217-8253-ff030363a3de)
![screencapture-localhost-5174-events-1-2025-03-15-20_46_47](https://github.com/user-attachments/assets/bf3d2a61-8916-4d6f-b06d-4b630eea4d4b)
![Screenshot 2025-03-15 204801](https://github.com/user-attachments/assets/37076c2a-2ff4-496f-8dd1-418cc47c6ee0)
![screencapture-localhost-5174-profile-1-2025-03-15-20_48_33](https://github.com/user-attachments/assets/c41ca3aa-287c-40e0-a777-e588821264d7)
![screencapture-localhost-5174-community-2-2025-03-15-20_48_20](https://github.com/user-attachments/assets/0ea14c6b-1f8e-40ec-abc9-1f526836cc45)



## 🚀 Features

- **Event Discovery**: Find events based on location, date, category, and personal interests
- **Community Engagement**: Join communities centered around shared interests
- **User Connections**: Connect with other users who share your interests
- **AI-Powered Assistant**: Get personalized event recommendations through our chatbot
- **Responsive Design**: Seamless experience across all devices
- **Dark/Light Mode**: Choose your preferred visual theme

## 📋 Project Structure

The project is divided into two main components:

### Frontend (React + TypeScript)

- Built with React 18 and TypeScript
- Styling with Tailwind CSS and Framer Motion for animations
- Responsive design with mobile-first approach
- State management with React hooks

### Backend (FastAPI + Python)

- RESTful API built with FastAPI framework
- AI-powered recommendations using Sentence Transformers
- Integration with Groq LLM for natural language processing
- Data processing and matching algorithms

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- Groq API key

### Backend Setup

1. Navigate to the Backend directory:

```bash
cd Backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up environment variables:

```bash
cp .env.example .env
```

5. Edit `.env` and add your Groq API key:

```
GROQ_API_KEY=your_groq_api_key_here
```

6. Start the server:

```bash
uvicorn server:app --reload --port 8000
```

### Frontend Setup

1. Navigate to the Frontend directory:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. The application will be available at `http://localhost:5173`

## 📱 Features Overview

### Event Discovery

Users can discover events through:
- Browsing recommended events on the homepage
- Using category filters to find specific types of events
- Using the AI assistant to find events matching their description
- Viewing detailed information about each event

### Community Engagement

- Join communities based on interests
- View community details and member activities
- Participate in community discussions
- Find related communities

### User Profiles

- Customize user profiles with interests and preferences
- Connect with other users who share similar interests
- View upcoming events and communities

### AI Assistant

- Natural language interface to find events
- Personalized recommendations based on user preferences
- Voice input support for accessibility

## 🧠 AI Implementation

The platform uses two key AI technologies:

1. **Sentence Transformers**: For semantic matching between user queries and events/communities
2. **Groq LLM**: For natural language understanding and generating responses in the assistant

## 🔧 Technical Details

### Frontend Technologies

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **React Router**: Navigation
- **AOS**: Animate on scroll library

### Backend Technologies

- **FastAPI**: Web framework for building APIs
- **Pydantic**: Data validation and settings management
- **Sentence-Transformers**: NLP for semantic search
- **Groq**: LLM integration for natural language understanding
- **Uvicorn**: ASGI server

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
