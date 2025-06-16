const micBtn = document.getElementById("mic-btn");
const voiceModal = document.getElementById("voice-modal");

micBtn.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("🎙️ Browser tidak mendukung voice recognition!");

  const recognition = new SpeechRecognition();
  recognition.lang = "id-ID";
  recognition.continuous = false;
  recognition.interimResults = false;

  // Tampilkan modal
  voiceModal.style.display = "flex";

  recognition.onresult = async (event) => {
    const spokenText = event.results[0][0].transcript;
    console.log("🎧 Kamu bilang:", spokenText);
    voiceModal.style.display = "none"; // Tutup modal

    appendMessage("user", spokenText);
    appendMessage("yuna", "⏳ Sedang berpikir...");

    try {
      const res = await fetch("https://yuna-ai.putridinar.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: spokenText }),
      });
      const data = await res.json();
      chatBox.lastChild.remove(); // hapus "sedang berpikir"
      appendMessage("yuna", data.reply);
      speak(data.reply);
    } catch (err) {
      appendMessage("yuna", "❌ YUNA mengalami kendala teknis.");
    }
  };

  recognition.onerror = (e) => {
    voiceModal.style.display = "none"; // Tutup modal jika error
    console.error("🎙️ Error mic:", e.error);
    alert("Mic error: " + e.error);
  };

new Audio('./assets/vendor/chat-up.mp3').play();

  recognition.start();
});
