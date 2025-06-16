// /assets/js/auth.js
(function () {
  const loginBtn = document.getElementById("loginModal");
  const logoutBtn = document.getElementById("logout-btn");

  // ❗ Masukkan ke dalam try untuk cek error firebase belum siap
  try {
    const auth = firebase.auth();

    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("✅ Login sebagai:", user.email);
        localStorage.setItem("uid", user.uid);
        if (logoutBtn) logoutBtn.classList.remove("d-none");
        if (loginBtn) loginModal.classList.add("d-none");
      } else {
        console.log("🔓 Belum login");
        localStorage.removeItem("uid");
        if (logoutBtn) logoutBtn.classList.add("d-none");
        if (loginBtn) loginModal.classList.remove("d-none");
      }
    });

    if (loginBtn) {
      document.getElementById("login-btn").addEventListener("click", async () => {
        try {
          const result = await auth.signInWithPopup(provider);
          const user = result.user;
          console.log("✅ Login sukses:", user.email);

          // Simpan user info atau reset limit di server
          localStorage.setItem("yunaUser", JSON.stringify({ email: user.email }));
          location.reload(); // Reload biar sistem tahu sudah login
        } catch (err) {
          console.error("❌ Gagal login:", err);
          alert("Gagal login, coba lagi nanti.");
        }
      });
    }

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

  } catch (e) {
    console.warn("⚠️ Firebase belum siap:", e.message);
  }
})();
