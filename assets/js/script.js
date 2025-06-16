const provider = new firebase.auth.GoogleAuthProvider();

const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

let chatCount = 0;
const LIMIT = 3;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (chatCount >= LIMIT && !firebase.auth().currentUser) {
    console.log("🚫 Limit tercapai, tampilkan modal login");

    // Pastikan elemen modal ada di DOM
    const modalElement = document.getElementById("loginModal");
    if (modalElement) {
      const loginModal = new bootstrap.Modal(modalElement);
      loginModal.show();
    } else {
      console.error("❌ Modal login tidak ditemukan di DOM");
    }
    return;
  }

  chatCount++;

  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  showThinking();

  try {
    const user = firebase.auth().currentUser;
    const uid = user ? user.uid : null;

    const res = await fetch("https://yuna-ai.putridinar.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message, uid, }),
    });

    // ⛔ Rate Limit
    if (res.status === 429) {
      const data = await res.json();
      chatBox.lastChild.remove();
      appendMessage("yuna", data?.error || "⚠️ Batas penggunaan gratis sudah tercapai. Silakan kembali besok ya 💖");
      return;
    }

    const data = await res.json();
    chatBox.lastChild.remove();

if (data.reply.includes("batas chat gratis")) {
  const modal = new bootstrap.Modal(document.getElementById("loginModal"));
  modal.show();
  return;
}

    const bubble = createBubble("yuna");
    chatBox.appendChild(bubble);
    scrollToBottom();

    await typeTextAndSpeak(data.reply || "Maaf, YUNA nggak ngerti 😅", (val) => {
      bubble.textContent = val;
      scrollToBottom();
    });

  } catch (err) {
    console.error("❌ Gagal minta balasan YUNA:", err);
    chatBox.lastChild.remove();
    appendMessage("yuna", "⚠️ YUNA lagi di perbaiki, coba lagi nanti ya.");
  }
});

function playBubbleSound() {
  const snd = new Audio("./assets/vendor/chat-up.mp3"); // Ganti ke path file kamu
  snd.volume = 0.2;
  snd.play().catch(() => {}); // Ignore auto-play block
} // 🔔

function appendMessage(sender, text) {
  const div = createBubble(sender);
  div.textContent = text;
  chatBox.appendChild(div);

  if (sender === "assistant") {
    playBubbleSound(); // cuma kalau dari AI
  }

  scrollToBottom();
}

function createBubble(sender) {
  const div = document.createElement("div");
  div.className = `chat-bubble ${sender}`;
  return div;
}

function showThinking() {
  appendMessage("yuna", "⏳ YUNA sedang berpikir...");
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function typeTextAndSpeak(text, callback) {
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();

  // Kadang suara belum ready langsung
  if (!voices.length) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    voices = synth.getVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  const voice = voices.find((v) =>
    v.lang === "id-ID" && v.name.toLowerCase().includes("female")
  );
  if (voice) utterance.voice = voice;

  synth.speak(utterance);

  let typed = "";
  for (const char of text) {
    typed += char;
    callback(typed);
    await new Promise((r) => setTimeout(r, 45 + Math.random() * 50));
  }
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function disableInput(state) {
  input.disabled = state;
  form.querySelector("button") && (form.querySelector("button").disabled = state);
}

window.addEventListener("DOMContentLoaded", async () => {
  const welcomeText = "Halo, aku YUNA! Siap bantu kamu hari ini ✨";

  // Balon chat kosong dulu buat diisi
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble yuna";
  chatBox.appendChild(bubble);

  // Bikin elemen indikator
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing-indicator";
  typingDiv.textContent = "✨ YUNA sedang mengetik...";
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  disableInput(true);

  // Delay kecil supaya suara keburu load
  await new Promise((r) => setTimeout(r, 100));

  await typeTextAndSpeak(welcomeText, (val) => {
    bubble.textContent = val;
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  typingDiv.remove(); // Hapus indikator setelah selesai
  disableInput(false);
});
