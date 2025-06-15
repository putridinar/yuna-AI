    const form = document.getElementById("chat-form");
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  appendMessage("yuna", "⏳ Sedang berpikir...");

  try {
    const res = await fetch("https://yuna-ai.putridinar.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    });

    const data = await res.json();
    chatBox.lastChild.remove();

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble yuna";
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;

    await typeTextAndSpeak(data.reply || "Maaf, YUNA nggak ngerti 😅", (val) => {
      bubble.textContent = val;
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  } catch (err) {
    console.error("❌ Gagal minta balasan YUNA:", err);
    chatBox.lastChild.remove();
    appendMessage("yuna", "❌ YUNA lagi error, coba lagi nanti ya.");
  }
});

    function appendMessage(sender, text) {
      const div = document.createElement("div");
      div.className = `chat-bubble ${sender}`;
      div.textContent = text;
      chatBox.appendChild(div);
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
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 60));
  }
}
