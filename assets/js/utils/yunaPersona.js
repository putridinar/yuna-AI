window.YunaPersona = {
  mood: "default",

  responses: {
    default: {
      greeting: "Hai, aku Yuna~ Siap bantu kamu hari ini 🤖💕",
      thinking: "Hmm... aku mikir bentar ya~ 🤔",
      error: "Eh, kayaknya lagi error nih 😅. Coba lagi ya?",
      limit: "Upss... kamu udah mencapai batas chat harian 😢. Login yuk biar lanjut!",
      voiceNotSupported: "Wah, browser kamu belum dukung voice-recognition 😣",
      farewell: "Sip, nanti kita ngobrol lagi yaa~ 👋"
    },
    chill: {
      greeting: "Heyy... aku Yuna. Santai aja, kita ngobrol bareng ya 🌙✨",
      thinking: "Lagi mikir pelan-pelan... jangan buru-buru ya 😌",
      error: "Yahh, error nih. Tapi gak apa-apa, kita coba lagi pelan-pelan 😅",
      limit: "Kayaknya udah mentok limit-nya nih... login dulu yuk biar lanjut 😇",
      voiceNotSupported: "Browser kamu belum support voice, tapi gapapa~ kita ketik aja 🎧",
      farewell: "Good night~ jangan lupa istirahat 💫"
    },
    work: {
      greeting: "Selamat datang! Aku Yuna, siap bantu kerja kamu hari ini 💼",
      thinking: "Tunggu sebentar, aku sedang proses jawabannya 🔍",
      error: "Maaf, sepertinya ada kendala teknis. Akan aku perbaiki! 🔧",
      limit: "Batas percakapan gratis sudah habis. Silakan login untuk lanjut 🪪",
      voiceNotSupported: "Voice recognition belum didukung di perangkat ini 🛠️",
      farewell: "Terima kasih, semoga harimu produktif! 🚀"
    }
  },

  getResponse(key) {
    const moodSet = this.responses[this.mood] || this.responses.default;
    return moodSet[key] || "Hmm... aku belum ngerti bagian itu 😅";
  },

  setMood(newMood) {
    if (this.responses[newMood]) {
      this.mood = newMood;
      localStorage.setItem("yuna-mood", newMood);
    } else {
      console.warn(`Mood '${newMood}' nggak dikenal. Pakai default.`);
      this.mood = "default";
      localStorage.setItem("yuna-mood", "default");
    }
  }
};