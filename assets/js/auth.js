// assets/js/auth.js
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const btnRegister = document.getElementById("btnRegister");
const btnLogin = document.getElementById("btnLogin");
const msg = document.getElementById("msg");

btnRegister.addEventListener("click", async () => {
  const email = document.getElementById("regEmail").value.trim();
  const pass = document.getElementById("regPassword").value;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", cred.user.uid), {
      email: email,
      role: "user",
      createdAt: new Date()
    });
    msg.style.color = "green";
    msg.innerText = "Registered — redirecting to dashboard...";
    setTimeout(()=> window.location.href = "dashboard.html", 900);
  } catch (e) {
    msg.style.color = "crimson";
    msg.innerText = e.message;
  }
});

btnLogin.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value;
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    // get role
    const udoc = await getDoc(doc(db, "users", cred.user.uid));
    const role = udoc.exists() && udoc.data().role === "admin" ? "admin" : "user";
    msg.style.color = "green";
    msg.innerText = "Login successful — redirecting...";
    setTimeout(()=> {
      if (role === "admin") window.location.href = "admin.html";
      else window.location.href = "dashboard.html";
    }, 800);
  } catch (e) {
    msg.style.color = "crimson";
    msg.innerText = e.message;
  }
});

// keep user signed-in check (optional)
onAuthStateChanged(auth, user => {
  if (user) {
    // optionally redirect to dashboard if already signed-in
  }
});

window.logout = async function() { await signOut(auth); window.location.href = "index.html"; }
