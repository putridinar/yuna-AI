
function speak(text) {
  if (!window.speechSynthesis) {
    console.warn("🛑 Browser tidak support suara.");
    return;
  }

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";

  // Cari suara cewek bahasa Indonesia, fallback kalau gak ada
  const voices = synth.getVoices();
  const voice = voices.find(v =>
    v.lang.startsWith("id") && v.name.toLowerCase().includes("female")
  );
  if (voice) {
    utterance.voice = voice;
  }

  synth.speak(utterance);
}