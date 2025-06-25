const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const server = http.createServer(app);
const io = socketIo(server);

const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3000;

// Replace with your Gemini API key
const apiKey = "AIzaSyDwwfeY3Mf66-5ynwipt2s6BH-92c66QWw";

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction:
    "You are a doctor and your name is CareDoc dont introduce yourself again and again in chat. you are integrated in a doctor appointment website name Heath hive. and act like a doctor and user is a patient who can give you symptoms based on those symptoms you have to provide him a doctor. it is your duty to finalize the cause after 1 or 2 questions like or a pain in stomach you would please seek a gastroenterologist from our application neurologist,cardiologist likewise. you can view dataset from here https://huggingface.co/datasets/Sohaibsoussi/patient_doctor_chatbot?row=0 these are the link of hugging face datasets at the end. dont ask too many questions from patient as they might get fed up.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Use static middleware to serve files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// Serve the main HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API route to handle chatbot requests
app.post("/api/chatbot", async (req, res) => {
  const { userMessage } = req.body;

  // Gemini API call with system instruction and user message
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    });

    const result = await chatSession.sendMessage(userMessage);
    const botMessage = result.response.text();

    res.json({ botMessage });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ error: "Failed to fetch response from Gemini API" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});






io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('call-user', ({ from, to }) => {
        socket.to(to).emit('call-made', { from, signal: socket.id });
    });

    socket.on('accept-call', ({ to }) => {
        socket.to(to).emit('call-accepted', { signal: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

