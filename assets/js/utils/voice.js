const micBtn = document.getElementById("mic-btn");
const voiceModal = document.getElementById("voice-modal");

micBtn.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("🎙️ Browser tidak mendukung voice recognition!");

  // Cek limit user
  const uid = localStorage.getItem("uid");
  const isAnon = !uid;

  // Limit hanya untuk anon
  if (isAnon) {
    const limitData = JSON.parse(localStorage.getItem("voice-limit") || "{}");
    const today = new Date().toDateString();

    if (limitData.date === today && limitData.count >= 3) {
      return alert("🛑 Batas penggunaan suara untuk tamu hari ini sudah habis.");
    }
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "id-ID";
  recognition.continuous = false;
  recognition.interimResults = false;

  // Timer untuk auto-stop (jika user diam)
  let silenceTimer = setTimeout(() => {
    recognition.stop();
    voiceModal.style.display = "none";
    alert("⏱️ Tidak terdeteksi suara, dihentikan otomatis.");
  }, 10000); // 10 detik

  // Tampilkan modal mendengarkan
  voiceModal.style.display = "flex";
  new Audio('./assets/vendor/chat-up.mp3').play();

  recognition.onresult = async (event) => {
    clearTimeout(silenceTimer);
    const spokenText = event.results[0][0].transcript;
    voiceModal.style.display = "none";

    appendMessage("user", spokenText);
    appendMessage("yuna", "⏳ Sedang berpikir...");

    try {
      const res = await fetch("https://yuna-ai.putridinar.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: spokenText, uid }),
      });

      const data = await res.json();
      chatBox.lastChild.remove();
      appendMessage("yuna", data.reply);
      speak(data.reply);

      // Tambah limit count untuk anon
      if (isAnon) {
        const oldData = JSON.parse(localStorage.getItem("voice-limit") || "{}");
        const count = (oldData.date === today ? oldData.count || 0 : 0) + 1;
        localStorage.setItem("voice-limit", JSON.stringify({ date: today, count }));
      }

      // Munculkan modal login jika limit tercapai
      if (data.limitReached) {
        const modal = new bootstrap.Modal(document.getElementById("loginModal"));
        modal.show();
      }

    } catch (err) {
      chatBox.lastChild.remove();
      appendMessage("yuna", "❌ YUNA mengalami kendala teknis.");
    }
  };

  recognition.onerror = (e) => {
    clearTimeout(silenceTimer);
    voiceModal.style.display = "none";
    alert("Mic error: " + e.error);
  };

  recognition.onend = () => {
    clearTimeout(silenceTimer);
    voiceModal.style.display = "none";
  };

  recognition.start();
});
