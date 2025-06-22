const chatbox = document.getElementById("chatbox");

function toggleTheme() {
  const body = document.body;
  const dark = body.classList.toggle("dark");
  body.classList.toggle("light");
  document.querySelector('.theme-toggle').textContent = dark ? '☀️ Chế độ sáng' : '🌑 Chế độ tối';
}

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.style.backgroundImage = role === "user"
    ? "url('https://cdn-icons-png.flaticon.com/512/1144/1144760.png')"
    : "url('https://cdn-icons-png.flaticon.com/512/4712/4712109.png')";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function callGemini(prompt) {
  try {
    const res = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    return data.reply || "❌ Không có phản hồi.";
  } catch (e) {
    console.error(e);
    return "❌ Không thể kết nối.";
  }
}

async function handleSend() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  appendMessage("user", text);
  input.value = "";

  appendMessage("bot", " Đang suy nghĩ…");
  const botBubbles = document.querySelectorAll(".message.bot .bubble");
  const current = botBubbles[botBubbles.length - 1];

  const reply = await callGemini(text);
  current.textContent = reply;
}
