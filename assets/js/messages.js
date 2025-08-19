// assets/js/messages.js
import { auth, db } from "./firebase.js";
import {
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const messagesDiv = document.getElementById("messages");
const btnSend = document.getElementById("btnSend");
const input = document.getElementById("messageInput");
const ticketHeader = document.getElementById("ticketHeader");

// get ticket id from query string
function getTicketId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

const ticketId = getTicketId();
if (!ticketId) {
  alert("No ticket id!");
  window.location.href = "dashboard.html";
}

onAuthStateChanged(auth, async (user) => {
  if (!user) { window.location.href = "index.html"; return; }

  // show ticket header info
  const ticketDocRef = doc(db, "tickets", ticketId);
  const ticketSnap = await getDoc(ticketDocRef);
  if (!ticketSnap.exists()) { alert("Ticket not found"); window.location.href = "dashboard.html"; return; }
  const t = ticketSnap.data();
  ticketHeader.innerHTML = `<h2>${escapeHtml(t.subject)} <small>(${t.status})</small></h2>`;

  // load messages realtime
  const q = query(collection(db, "tickets", ticketId, "messages"), orderBy("createdAt", "asc"));
  onSnapshot(q, snap => {
    messagesDiv.innerHTML = "";
    snap.forEach(docSnap => {
      const m = docSnap.data();
      const div = document.createElement("div");
      div.className = "message";
      div.classList.add(m.userId === user.uid ? "user" : "admin");
      div.innerHTML = `<strong>${escapeHtml(m.userEmail || m.email || 'User')}:</strong> ${escapeHtml(m.text)}`;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  // send message
  btnSend.addEventListener("click", async () => {
    const txt = input.value.trim();
    if (!txt) return;
    await addDoc(collection(db, "tickets", ticketId, "messages"), {
      text: txt,
      userId: user.uid,
      userEmail: user.email,
      createdAt: serverTimestamp()
    });
    input.value = "";
  });

});

function escapeHtml(unsafe) {
  return unsafe ? unsafe.replace(/[&<"'>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])) : '';
}
