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
    // bisa tambah 'chill', 'work', dll
  },

  getResponse(key) {
    const moodSet = this.responses[this.mood] || this.responses.default;
    return moodSet[key] || "Hmm... aku belum ngerti bagian itu 😅";
  },

  setMood(newMood) {
    if (this.responses[newMood]) {
      this.mood = newMood;
    } else {
      console.warn(`Mood '${newMood}' nggak dikenal. Pakai default.`);
      this.mood = "default";
    }
  }
};