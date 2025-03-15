# Event Hub Platform

Event Hub is a modern event discovery and community engagement platform that helps users find events, connect with like-minded individuals, and join communities based on their interests.

![screencapture-localhost-5174-2025-03-15-20_45_34](https://github.com/user-attachments/assets/2d0a0b18-0d1b-44ef-9372-cce9e0de969d)
![screencapture-localhost-5174-events-2025-03-15-20_46_19](https://github.com/user-attachments/assets/ac1f97b0-837e-42c3-a4fd-5c94cfc06fe4)
![screencapture-localhost-5174-events-1-2025-03-15-20_46_47](https://github.com/user-attachments/assets/0a4f233a-7b0f-4ef2-94fd-c94d54c0f84a)
![Screenshot 2025-03-15 204801](https://github.com/user-attachments/assets/f4a9fba9-9cbc-452a-8c15-38f27d703b9e)
![screencapture-localhost-5174-community-2-2025-03-15-20_48_20](https://github.com/user-attachments/assets/ac6587ae-6b06-482f-848c-fb5cc3ca182b)
![screencapture-localhost-5174-profile-1-2025-03-15-20_48_33](https://github.com/user-attachments/assets/ef04ed7b-e731-4590-974f-4051c9caa92f)

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

## 👥 Team

- Frontend Developer: [Your Name]
- Backend Developer: [Your Name]
- UI/UX Designer: [Your Name]

## 📞 Contact

For any inquiries, please contact us at [email@example.com]
