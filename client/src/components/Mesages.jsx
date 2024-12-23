import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Messages = () => {
  const { conversationId } = useParams(); // Get the conversation ID from URL
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [error, setError] = useState(null);

  // Fetch the messages (similar to previous example)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/conversations/${conversationId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
      } catch (err) {
        setError("Failed to fetch messages");
        console.error(err);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // Handle sending the message
  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/conversations/${conversationId}/messages`,
        { content: messageContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prevMessages) => [...prevMessages, response.data]); // Add the new message to the state
      setMessageContent(""); // Clear the message input field
    } catch (err) {
      setError("Failed to send message");
      console.error(err);
    }
  };

  return (
    <div className="text-white bg-black h-full">
      <h1 className="text-center text-2xl font-bold mb-4">Messages</h1>
      {error && <div className="text-center text-red-500">{error}</div>}
      <div className="space-y-2">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div key={message._id} className="px-4 py-2 bg-gray-700 rounded-lg">
              <strong>{message.senderId.name}:</strong> {message.content}
              {/* Optionally, add timestamp */}
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <textarea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 rounded-lg"
          placeholder="Type a message"
        />
        <button
          onClick={handleSendMessage}
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Messages;
