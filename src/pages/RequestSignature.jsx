// File: client/src/pages/RequestSignature.jsx

import React, { useState } from "react";

const RequestSignature = () => {
  const [email, setEmail] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/request-signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email, documentId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Signature request sent successfully!");
        setEmail("");
        setDocumentId("");
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to send request");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleRequest}
        className="bg-white shadow-md rounded p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Request Signature</h2>

        <label className="block mb-2">Recipient Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />

        <label className="block mb-2">Document ID:</label>
        <input
          type="text"
          required
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send Signature Request
        </button>

        {message && (
          <p className="mt-4 text-center font-medium text-sm text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default RequestSignature;
