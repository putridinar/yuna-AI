// /assets/js/auth.js
(function () {
  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  try {
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("✅ Login sebagai:", user.email);
        localStorage.setItem("uid", user.uid);
        if (logoutBtn) logoutBtn.classList.remove("d-none");
        if (loginModal) loginModal.classList.add("d-none");
      } else {
        console.log("🔓 Belum login");
        localStorage.removeItem("uid");
        if (logoutBtn) logoutBtn.classList.add("d-none");
        if (loginModal) loginModal.classList.remove("d-none");
      }
    });

    if (loginBtn) {
      loginBtn.addEventListener("click", async () => {
        try {
          const result = await auth.signInWithPopup(provider);
          const user = result.user;
          console.log("🙋‍♀️ Login sukses:", user.email);

          // Simpan user info ke localStorage jika perlu
          localStorage.setItem("yunaUser", JSON.stringify({ email: user.email }));

          location.reload();
        } catch (err) {
          console.error("❌ Gagal login:", err);
          alert("Gagal login. Coba lagi ya!");
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        try {
          await auth.signOut();
          localStorage.removeItem("uid");
          localStorage.removeItem("yunaUser");
          alert("Kamu berhasil logout!");
          location.reload();
        } catch (err) {
          console.error("❌ Gagal logout:", err);
        }
      });
    }

  } catch (err) {
    console.error("❌ Firebase belum siap:", err);
  }
})();
