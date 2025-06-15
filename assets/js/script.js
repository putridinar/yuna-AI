const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  showThinking();

  try {
    const res = await fetch("https://yuna-ai.putridinar.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
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
    appendMessage("yuna", "❌ YUNA lagi error, coba lagi nanti ya.");
  }
});

function appendMessage(sender, text) {
  const div = createBubble(sender);
  div.textContent = text;
  chatBox.appendChild(div);
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
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";

  const voice = synth.getVoices().find(
    (v) => v.lang === "id-ID" && v.name.toLowerCase().includes("female")
  );
  if (voice) utterance.voice = voice;

  synth.speak(utterance);

  let typed = "";
  for (const char of text) {
    typed += char;
    callback(typed);
    await delay(45 + Math.random() * 55);
  }
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
