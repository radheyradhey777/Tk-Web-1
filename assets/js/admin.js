import { auth, db } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const allTickets = document.getElementById("allTickets");

onSnapshot(collection(db, "tickets"), (snapshot) => {
  allTickets.innerHTML = "";
  snapshot.forEach((doc) => {
    allTickets.innerHTML += `<li><b>${doc.data().subject}</b> - ${doc.data().status}</li>`;
  });
});

window.logout = async function () {
  await signOut(auth);
  window.location.href = "index.html";
};
