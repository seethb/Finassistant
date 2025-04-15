const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");
const userSelect = document.getElementById("user-select");

async function sendMessage() {
  const message = messageInput.value.trim();
  const userId = parseInt(userSelect.value, 10);

  if (!message || isNaN(userId)) return;

  appendMessage("You", message);
  messageInput.value = "";

  try {
    const response = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message }),
    });

    const data = await response.json();

    if (data.reply) {
      appendMessage("AI", data.reply);
      speak(data.reply); // Voice out response
    } else {
      appendMessage("AI", "❌ Something went wrong (no reply).");
      console.error("Response received:", data);
    }
  } catch (error) {
    appendMessage("AI", "❌ Something went wrong.");
    console.error("Error calling /chat:", error);
  }
}

function appendMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = `${sender}: ${text}`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    appendMessage("🔊", "Listening...");
  };

  recognition.onerror = (event) => {
    appendMessage("🔊", `Voice error: ${event.error}`);
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    messageInput.value = transcript;
    sendMessage();
  };

  recognition.start();
}

//  Voice output
function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}
