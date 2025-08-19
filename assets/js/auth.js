import { auth, db } from "./firebase.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Register Function
async function registerUser() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user role to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "user",
      createdAt: new Date()
    });

    alert("✅ Registration successful!");
    window.location.href = "dashboard.html";

  } catch (error) {
    alert("❌ " + error.message);
  }
}

// ✅ Login Function
async function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("✅ Login successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("❌ " + error.message);
  }
}

// ✅ Make available to HTML
window.registerUser = registerUser;
window.loginUser = loginUser;
