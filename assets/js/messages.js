import { auth, db } from "./firebase.js";
import { 
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Send message function
async function sendMessage(ticketId) {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();

  if (!text) return;

  try {
    await addDoc(collection(db, "tickets", ticketId, "messages"), {
      text: text,
      userId: auth.currentUser.uid,
      email: auth.currentUser.email,
      createdAt: serverTimestamp()
    });

    input.value = ""; // Clear input
  } catch (error) {
    alert("❌ Error sending message: " + error.message);
  }
}

// ✅ Load messages in real-time
function loadMessages(ticketId) {
  const msgContainer = document.getElementById("messages");

  const q = query(
    collection(db, "tickets", ticketId, "messages"),
    orderBy("createdAt", "asc")
  );

  onSnapshot(q, (snapshot) => {
    msgContainer.innerHTML = ""; // Clear

    snapshot.forEach((doc) => {
      const msg = doc.data();

      const div = document.createElement("div");
      div.classList.add("message");

      // Admin check (simple way: Gmail से या role later)
      if (msg.userId === auth.currentUser.uid) {
        div.classList.add("me");
      } else {
        div.classList.add("other");
      }

      div.innerHTML = `<b>${msg.email}:</b> ${msg.text}`;
      msgContainer.appendChild(div);
    });

    // Auto scroll bottom
    msgContainer.scrollTop = msgContainer.scrollHeight;
  });
}

// ✅ Expose to HTML
window.sendMessage = sendMessage;
window.loadMessages = loadMessages;
