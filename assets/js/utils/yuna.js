// ✅ yuna.js - gabungan voice + logic YUNA utama

const savedMood = localStorage.getItem("yuna-mood");
if (savedMood) window.YunaPersona.setMood(savedMood);

window.addEventListener("DOMContentLoaded", async () => {
  const welcome = window.YunaPersona.getResponse("greeting");
  const bubble = createBubble("yuna");
  chatBox.appendChild(bubble);
  scrollToBottom();
  showThinking();
  await new Promise((r) => setTimeout(r, 300));
  chatBox.lastChild.remove();

  await typeTextAndSpeak(welcome, (val) => {
    bubble.textContent = val;
    scrollToBottom();
  });
});

const savedMood = localStorage.getItem("yuna-mood");
if (savedMood) window.YunaPersona.setMood(savedMood);

const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
let chatCount = 0;
const LIMIT = 3;

// 🎤 Voice Modal dan Trigger
const micBtn = document.getElementById("mic-btn");
const voiceModal = document.getElementById("voice-modal");
let recognition;

micBtn?.addEventListener("click", () => {
  showVoiceModal();
  startListening();
});

function showVoiceModal() {
  voiceModal.style.display = "flex";
  setTimeout(() => {
    if (voiceModal.style.display === "flex") {
      stopListening();
    }
  }, 10000); // ⏳ 10 detik max
}

function hideVoiceModal() {
  voiceModal.style.display = "none";
}

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("🎙️ Browser kamu belum support voice recognition!");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "id-ID";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const spoken = event.results[0][0].transcript;
    hideVoiceModal();
    handleVoiceInput(spoken);
  };

  recognition.onerror = () => hideVoiceModal();
  recognition.onend = () => hideVoiceModal();

  recognition.start();
}

function stopListening() {
  if (recognition) recognition.stop();
}

// 🎯 Input Form Trigger
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  input.value = "";
  appendMessage("user", message);
  handleRequest(message);
});

function handleVoiceInput(text) {
  appendMessage("user", text);
  handleRequest(text);
}

async function handleRequest(prompt) {
  const user = firebase.auth().currentUser;
  const uid = user ? user.uid : null;
  const isAnon = !uid;

  if (isAnon && chatCount >= LIMIT) return showLoginModal();
  if (isAnon) chatCount++;

  showThinking();

  try {
    const res = await fetch("https://yuna-ai.putridinar.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, uid }),
    });

    if (res.status === 429) {
      chatBox.lastChild.remove();
      appendMessage("yuna", "🫣 Batas penggunaan gratis sudah tercapai.");
      return showLoginModal();
    }

    const data = await res.json();
    chatBox.lastChild.remove();

    if (data.limitReached) return showLoginModal();

    const bubble = createBubble("yuna");
    chatBox.appendChild(bubble);
    scrollToBottom();

    await typeTextAndSpeak(data.reply || "Maaf, YUNA nggak ngerti 😅", (val) => {
      bubble.textContent = val;
      scrollToBottom();
    });

  } catch (err) {
    console.error("❌ Gagal minta balasan:", err);
    chatBox.lastChild.remove();
    appendMessage("yuna", "😵 YUNA lagi error. Coba lagi nanti.");
  }
}

function showLoginModal() {
  const modal = new bootstrap.Modal(document.getElementById("loginModal"));
  modal.show();
}

function appendMessage(sender, text) {
  const div = createBubble(sender);
  div.textContent = text;
  chatBox.appendChild(div);
  if (sender === "yuna") playBubbleSound();
  scrollToBottom();
}

function showThinking() {
  appendMessage("yuna", "🤔 YUNA sedang berpikir...");
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function createBubble(sender) {
  const div = document.createElement("div");
  div.className = `chat-bubble ${sender}`;
  return div;
}

function playBubbleSound() {
  const snd = new Audio("./assets/vendor/chat-up.mp3");
  snd.volume = 0.2;
  snd.play().catch(() => {});
}

async function typeTextAndSpeak(text, callback) {
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();

  if (!voices.length) {
    await new Promise((r) => setTimeout(r, 100));
    voices = synth.getVoices();
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "id-ID";
  const voice = voices.find(v => v.lang === "id-ID" && v.name.toLowerCase().includes("female"));
  if (voice) utter.voice = voice;
  synth.speak(utter);

  let typed = "";
  for (const char of text) {
    typed += char;
    callback(typed);
    await new Promise((r) => setTimeout(r, 45 + Math.random() * 50));
  }
}

// Welcome
window.addEventListener("DOMContentLoaded", async () => {
  const welcome = "Halo, aku YUNA! Siap bantu kamu hari ini ✨";
  const bubble = createBubble("yuna");
  chatBox.appendChild(bubble);
  scrollToBottom();
  showThinking();
  await new Promise((r) => setTimeout(r, 200));
  chatBox.lastChild.remove();
  await typeTextAndSpeak(welcome, (val) => {
    bubble.textContent = val;
    scrollToBottom();
  });
});
