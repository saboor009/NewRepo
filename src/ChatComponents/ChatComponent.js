import React, { useState, useRef, useEffect } from "react";
import OpenAI from "openai";
import "../ChatComponents/ChatComponent.css";
import ReactMarkdown from "react-markdown";
import send from "../icons/arrow-up-left.svg";
import { useNavigate } from "react-router-dom";

// ✅ Read the API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Use env variable
  dangerouslyAllowBrowser: true,
});

function ChatComponent({ onClose }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setChatHistory([
      {
        type: "answer",
        content:
          "Hi, I'm CareDoc, your virtual cardiologist. Please describe any symptoms like chest pain, shortness of breath, or heart palpitations.",
      },
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const preprocessQuestion = (input) => {
    return input.trim().replace(/[^a-zA-Z0-9 ?!.,/%()-]/g, "");
  };

  const generateAnswer = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const currentQuestion = preprocessQuestion(question);
    setQuestion("");
    setGeneratingAnswer(true);
    setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }]);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a virtual cardiologist named CareDoc on a platform called Medease.
Your job is to:
- Ask at most two clarifying questions related to heart health (e.g., chest pain, palpitations, dizziness).
- After the patient's response, suggest a likely cardiac issue or advice.
- Do not refer to general medicine. Avoid repeating your name or role.`,
          },
          ...chatHistory.map((chat) => ({
            role: chat.type === "question" ? "user" : "assistant",
            content: chat.content,
          })),
          {
            role: "user",
            content: currentQuestion,
          },
        ],
        temperature: 0.7,
      });

      const aiResponse = response.choices[0].message.content;
      setChatHistory((prev) => [...prev, { type: "answer", content: aiResponse }]);
    } catch (error) {
      console.error("OpenAI error:", error);
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: "Sorry, something went wrong. Please try again." },
      ]);
    }

    setGeneratingAnswer(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-container-child">
        <div className="chat-history-main">
          <div ref={chatContainerRef} className="chat-history">
            {chatHistory.map((chat, index) => (
              <div key={index} className={`chat-${chat.type}`}>
                <ReactMarkdown>{chat.content}</ReactMarkdown>
              </div>
            ))}
            {generatingAnswer && (
              <div className="chat-answer thinking">
                <em>CareDoc is analyzing your symptoms...</em>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <form onSubmit={generateAnswer} className="chat-input">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Describe your symptoms..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>

            <button type="submit" disabled={generatingAnswer} className="submit-button">
              <img src={send} alt="Send" className="button-icon" />
              {generatingAnswer && <span className="loader"></span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;