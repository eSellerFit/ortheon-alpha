import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

function App() {
  const [status, setStatus] = useState("Not tested yet");

  async function handleTestWrite() {
    try {
      setStatus("Writing to Firestore...");

      const docRef = await addDoc(collection(db, "testWrites"), {
        source: "ortheon-alpha-local",
        message: "Firestore connection works",
        createdAt: serverTimestamp(),
      });

      setStatus(`Success. Test document created: ${docRef.id}`);
    } catch (error) {
      console.error("Firestore test failed:", error);
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Ortheon Alpha</h1>

      <p>
        This is a temporary Firebase connection test screen.
      </p>

      <button
        onClick={handleTestWrite}
        style={{
          padding: "12px 18px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "8px",
          border: "1px solid #333",
        }}
      >
        Test Firestore Write
      </button>

      <p style={{ marginTop: "20px" }}>
        <strong>Status:</strong> {status}
      </p>
    </main>
  );
}

export default App;
