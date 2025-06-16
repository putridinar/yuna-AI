const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

// Deteksi status login
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("✅ Login sebagai:", user.email);
    localStorage.setItem("uid", user.uid);
    logoutBtn.classList.remove("d-none");
    if (loginBtn) loginBtn.classList.add("d-none");
  } else {
    console.log("🔓 Belum login");
    localStorage.removeItem("uid");
    logoutBtn.classList.add("d-none");
    if (loginBtn) loginBtn.classList.remove("d-none");
  }
});

// Tombol login Google
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
    } catch (err) {
      console.error("❌ Gagal login:", err);
      alert("Login gagal. Coba lagi!");
    }
  });
}

// Tombol logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("uid");
      alert("Kamu berhasil logout!");
      location.reload();
    } catch (err) {
      console.error("❌ Gagal logout:", err);
      alert("Logout gagal!");
    }
  });
}
