// assets/js/admin.js
import { auth, db } from "./firebase.js";
import {
  collection, onSnapshot, orderBy, query, addDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const allTicketsDiv = document.getElementById("allTickets");

onAuthStateChanged(auth, async (user) => {
  if (!user) { window.location.href = "index.html"; return; }

  // optional: check role via Firestore doc or custom claim
  const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
  onSnapshot(q, snap => {
    allTicketsDiv.innerHTML = "";
    snap.forEach(docSnap => {
      const t = docSnap.data();
      const id = docSnap.id;
      const card = document.createElement("div");
      card.className = "ticket";
      card.innerHTML = `
        <h3>${escapeHtml(t.subject)}</h3>
        <small>${escapeHtml(t.userEmail || t.userId)}</small>
        <p>Status: <b>${t.status}</b></p>
        <div style="margin-top:8px;">
          <a class="btn btn-primary" href="ticket.html?id=${id}">Open</a>
          <button class="btn" onclick="reply('${id}')">Reply</button>
          <button class="btn btn-danger" onclick="closeTicket('${id}')">Close</button>
        </div>
      `;
      allTicketsDiv.appendChild(card);
    });
  });
});

// reply — open a prompt and add message
window.reply = async (ticketId) => {
  const text = prompt("Type reply to user:");
  if (!text) return;
  await addDoc(collection(db, "tickets", ticketId, "messages"), {
    text,
    userId: auth.currentUser.uid,
    userEmail: auth.currentUser.email,
    createdAt: serverTimestamp()
  });
};

// close ticket
window.closeTicket = async (ticketId) => {
  try {
    const dref = doc(db, "tickets", ticketId);
    await updateDoc(dref, { status: "closed" });
    alert("Ticket closed");
  } catch (e) { alert(e.message); }
};

function escapeHtml(unsafe) {
  return unsafe ? unsafe.replace(/[&<"'>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])) : '';
}
