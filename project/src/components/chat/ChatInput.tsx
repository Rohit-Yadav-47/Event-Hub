import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, StopCircle } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleVoiceInput = () => {
    // Check for browser compatibility
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionConstructor();
      recognition.continuous = false; // Stop automatically when user stops speaking
      recognition.interimResults = true; // Enable interim results for real-time feedback
      recognition.lang = 'en-US'; // Set language as needed

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
        console.log('Transcript updated:', finalTranscript + interimTranscript);

        // If the result is final, send the message
        if (finalTranscript.trim()) {
          console.log('Final transcript detected. Sending message:', finalTranscript.trim());
          onSendMessage(finalTranscript.trim());
          setInput(''); // Clear the input field
          setTranscript(''); // Clear the transcript
          recognition.stop(); // Stop recognition after sending
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        alert(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        // No need to send message here since it's handled in onresult
      };

      recognitionRef.current = recognition;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <>
      {/* Chat Input Form */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about events (e.g., 'Find me music events this weekend')"
              className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || isListening}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isListening ? 'bg-blue-50 text-blue-600' : ''
              }`}
              aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            >
              {isListening ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              type="submit"
              disabled={isLoading || isListening}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Full-Screen Overlay for Voice Input */}
      {isListening && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg w-11/12 max-w-md text-center">
            <Mic className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Listening...</h2>
            <p className="text-gray-600 mb-4">Please speak your message clearly.</p>
            {/* Optional: Display Real-Time Transcript */}
            <div className="w-full bg-gray-100 rounded-lg p-4 mb-4 min-h-[80px] flex items-center justify-center">
              <p className="text-gray-700 break-words">{transcript || '...'}</p>
            </div>
            <button
              type="button"
              onClick={handleVoiceInput}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </>
  );
}
