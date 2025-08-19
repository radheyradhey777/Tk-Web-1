import { auth, db } from "./firebase.js";
import { addDoc, collection, onSnapshot, query, where } 
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const ticketList = document.getElementById("ticketList");

window.createTicket = async function () {
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  await addDoc(collection(db, "tickets"), {
    user: auth.currentUser.uid,
    subject,
    message,
    status: "open",
    created: new Date()
  });

  alert("✅ Ticket created!");
};

// Load user tickets
const q = query(collection(db, "tickets"), where("user", "==", auth.currentUser?.uid));
onSnapshot(q, (snapshot) => {
  ticketList.innerHTML = "";
  snapshot.forEach((doc) => {
    ticketList.innerHTML += `<li>${doc.data().subject} - ${doc.data().status}</li>`;
  });
});
