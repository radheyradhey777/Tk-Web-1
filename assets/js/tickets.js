// assets/js/tickets.js
import { auth, db } from "./firebase.js";
import {
  addDoc, collection, serverTimestamp, query, where, onSnapshot, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const ticketsContainer = document.getElementById("ticketsContainer");
const btnCreate = document.getElementById("btnCreate");

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  // load user's tickets
  const q = query(collection(db, "tickets"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
  onSnapshot(q, snap => {
    ticketsContainer.innerHTML = "";
    snap.forEach(doc => {
      const t = doc.data();
      const card = document.createElement("div");
      card.className = "ticket";
      card.innerHTML = `
        <h3>${escapeHtml(t.subject)}</h3>
        <small>${new Date(t.createdAt?.toMillis?.() || t.createdAt).toLocaleString()}</small>
        <p>Status: <b>${t.status}</b></p>
        <div style="margin-top:8px;">
          <a class="btn btn-primary" href="ticket.html?id=${doc.id}">Open</a>
          <button class="btn btn-danger" onclick="closeTicket('${doc.id}')">Close</button>
        </div>
      `;
      ticketsContainer.appendChild(card);
    });
  });
});

btnCreate?.addEventListener("click", async () => {
  const subject = document.getElementById("subject").value.trim();
  const firstMsg = document.getElementById("firstMsg").value.trim();
  if (!subject || !firstMsg) return alert("Enter subject and message");

  const user = auth.currentUser;
  if (!user) return alert("Not signed in");

  const ticketRef = await addDoc(collection(db, "tickets"), {
    subject,
    userId: user.uid,
    userEmail: user.email,
    status: "open",
    createdAt: serverTimestamp()
  });

  // first message in messages subcollection
  await addDoc(collection(db, "tickets", ticketRef.id, "messages"), {
    text: firstMsg,
    userId: user.uid,
    userEmail: user.email,
    createdAt: serverTimestamp()
  });

  document.getElementById("subject").value = "";
  document.getElementById("firstMsg").value = "";
  window.location.href = `ticket.html?id=${ticketRef.id}`;
});

// close ticket function (client side just update)
window.closeTicket = async (ticketId) => {
  try {
    const tRef = collection(db, "tickets");
    // update via patch
    const docRef = doc(db, "tickets", ticketId);
    await updateDoc(docRef, { status: "closed" });
    alert("Closed");
  } catch (e) {
    alert("Error: " + e.message);
  }
};

// small helper
function escapeHtml(unsafe) {
  return unsafe ? unsafe.replace(/[&<"'>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])) : '';
}
