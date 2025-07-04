// import React, { useState, useEffect, useRef } from "react";
// import PdfPreview from "../components/PdfPreview";
// import SignatureInput from "../components/SignatureInput";
// import Draggable from "react-draggable";
// import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon } from "lucide-react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { PenLine } from "lucide-react";

// const Upload = () => {
//   const [pdfFile, setPdfFile] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [signature, setSignature] = useState({ name: "", fontClass: "" });
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [savedSignatures, setSavedSignatures] = useState([]);
//   const [emailToSend, setEmailToSend] = useState("");

//   const documentId = "demo-doc";
//   const pdfRef = useRef();

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file?.type === "application/pdf") {
//       setPdfFile(file);
//       setCurrentPage(1);
//     } else {
//       alert("Please upload a valid PDF file.");
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   useEffect(() => {
//     const fetchSavedSignatures = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/signatures?documentId=${documentId}&page=${currentPage}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         const data = await res.json();
//         if (Array.isArray(data)) setSavedSignatures(data);
//         else setSavedSignatures([]);
//       } catch (err) {
//         console.error("Fetch failed", err);
//         setSavedSignatures([]);
//       }
//     };
//     if (pdfFile) fetchSavedSignatures();
//   }, [currentPage, pdfFile]);

//   const handleSaveSignature = async () => {
//     if (!signature.name) return alert("Please type your signature.");
//     const payload = {
//       documentId,
//       x: position.x,
//       y: position.y,
//       page: currentPage,
//       font: signature.fontClass,
//       text: signature.name,
//     };
//     try {
//       const res = await fetch("http://localhost:5000/api/signatures", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         alert("Signature saved!");
//         setSavedSignatures((prev) => [...prev, { ...payload, _id: data._id }]);
//         setSignature({ name: "", fontClass: "" });
//       }
//     } catch (err) {
//       console.error("Save failed", err);
//     }
//   };

//   const handleDrag = (e, data) => setPosition({ x: data.x, y: data.y });

//   const handleDelete = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/api/signatures/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setSavedSignatures((prev) => prev.filter((sig) => sig._id !== id));
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   const handleSavedDragStop = async (id, data) => {
//     try {
//       await fetch(`http://localhost:5000/api/signatures/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ x: data.x, y: data.y }),
//       });
//     } catch (err) {
//       console.error("Update position failed", err);
//     }
//   };

//   const handleDownloadFullPDF = async () => {
//     if (!pdfFile || !numPages) return;
//     const pdf = new jsPDF();
//     for (let page = 1; page <= numPages; page++) {
//       setCurrentPage(page);
//       await new Promise((r) => setTimeout(r, 800));
//       const container = document.getElementById("pdf-capture");
//       const canvas = await html2canvas(container);
//       const imgData = canvas.toDataURL("image/png");
//       const width = pdf.internal.pageSize.getWidth();
//       const height = (canvas.height * width) / canvas.width;
//       if (page > 1) pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, 0, width, height);
//     }
//     const pdfBlob = pdf.output("blob");
//     const formData = new FormData();
//     formData.append("pdf", pdfBlob, "signed-document.pdf");
//     try {
//       const uploadRes = await fetch("http://localhost:5000/api/upload/upload-signed-pdf", {
//         method: "POST",
//         body: formData,
//       });
//       const uploadData = await uploadRes.json();
//       if (uploadRes.ok) {
//         alert("Signed PDF uploaded to server ✅");
//         localStorage.setItem("signedFilename", uploadData.filename);
//       } else alert(uploadData.error || "Upload failed ❌");
//     } catch (err) {
//       console.error("Upload error:", err);
//     }
//   };

//   const handleDownloadFromServer = async () => {
//     const filename = localStorage.getItem("signedFilename");
//     if (!filename) return alert("No signed file found. Please sign and upload first.");
//     try {
//       const response = await fetch(`http://localhost:5000/api/upload/signed/${filename}`);
//       if (!response.ok) throw new Error("Failed to fetch file");
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//       alert("Download failed ❌");
//     }
//   };

//   const handleSendEmail = async () => {
//     const filename = localStorage.getItem("signedFilename");
//     if (!filename) return alert("Please upload the signed PDF before emailing.");
//     try {
//       const res = await fetch("http://localhost:5000/api/email/send-signed-pdf", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: emailToSend, filename }),
//       });
//       const data = await res.json();
//       if (res.ok) alert("PDF sent to email ✅");
//       else alert(data.error || "Failed to send email.");
//     } catch (err) {
//       console.error("Error occurred:", err);
//     }
//   };

//   return (
//     <div className="flex flex-row min-h-screen">
//       <div className="w-2/3 p-4 flex flex-col items-center">
//         <input type="file" accept="application/pdf" onChange={handleFileChange} />
//         {numPages && (
//           <div className="flex items-center space-x-4 mt-4 bg-blue-100 px-4 py-2 rounded shadow">
//             <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="flex items-center gap-1">
//               <ArrowLeftIcon className="w-4 h-4" /> Previous
//             </button>
//             <p className="font-semibold">Page {currentPage} of {numPages}</p>
//             <button onClick={() => setCurrentPage((p) => Math.min(p + 1, numPages))} className="flex items-center gap-1">
//               Next <ArrowRightIcon className="w-4 h-4" />
//             </button>
//           </div>
//         )}

//         {pdfFile && (
//           <div ref={pdfRef} id="pdf-capture" className="relative mt-4 border shadow-md">
//             <PdfPreview file={pdfFile} pageNumber={currentPage} onLoadSuccess={onDocumentLoadSuccess} />
//             {savedSignatures.filter((sig) => sig.page === currentPage).map((sig) => (
//               <Draggable key={sig._id} defaultPosition={{ x: sig.x, y: sig.y }} onStop={(e, d) => handleSavedDragStop(sig._id, d)}>
//                 <div className={`absolute ${sig.font} text-xl bg-white px-2 py-1 rounded shadow cursor-move`} style={{ zIndex: 10 }}>
//                   {sig.text}
//                   <button onClick={() => handleDelete(sig._id)} className="ml-2 text-red-600 font-bold">×</button>
//                 </div>
//               </Draggable>
//             ))}
//             {signature.name && (
//               <Draggable onStop={handleDrag}>
//                 <div className={`absolute top-0 left-0 text-2xl ${signature.fontClass}`} style={{ color: "#2c2c2c", cursor: "move" }}>
//                   {signature.name}
//                   <button onClick={() => setSignature({ name: "", fontClass: "" })} className="ml-2 text-red-600 font-bold">×</button>
//                 </div>
//               </Draggable>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="w-1/3 p-6 bg-gray-100 flex flex-col justify-between">
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Type Your Signature</h2>
//           <SignatureInput onChange={setSignature} />
//           {signature.name && (
//             <>
//               <div className={`mt-4 p-2 border rounded text-2xl ${signature.fontClass}`}>Preview: {signature.name}</div>
//               <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded w-full" onClick={handleSaveSignature}>Save Signature</button>
//             </>
//           )}
//         </div>
//         <button className="mt-6 px-4 py-2 bg-blue-700 text-white rounded flex items-center justify-center gap-2" onClick={handleDownloadFullPDF}>
//           <PenLine className="w-5 h-5" /> Sign Document
//         </button>
//         <button className="mt-2 px-4 py-2 bg-gray-800 text-white rounded flex items-center justify-center gap-2" onClick={handleDownloadFromServer}>
//           <DownloadIcon className="w-5 h-5" /> Download Signed PDF
//         </button>
//         <input type="email" placeholder="Enter email to send" value={emailToSend} onChange={(e) => setEmailToSend(e.target.value)} className="mt-4 px-3 py-2 border rounded w-full" />
//         <button className="mt-2 px-4 py-2 bg-purple-700 text-white rounded w-full" onClick={handleSendEmail}>Send Signed PDF to Email</button>
//       </div>
//     </div>
//   );
// };


// export default Upload;

import React, { useState, useEffect, useRef } from "react";
import PdfPreview from "../components/PdfPreview";
import SignatureInput from "../components/SignatureInput";
import Draggable from "react-draggable";
import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon, PenLine } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Upload = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [signature, setSignature] = useState({ name: "", fontClass: "" });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [savedSignatures, setSavedSignatures] = useState([]);
  const [emailToSend, setEmailToSend] = useState("");

  const documentId = "demo-doc";
  const pdfRef = useRef();

 const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file?.type === "application/pdf") {
    setPdfFile(file);
    setCurrentPage(1);

    // 🔥 Count uploaded for this user
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;
    if (email) {
      let uploadedDocs = JSON.parse(localStorage.getItem("uploadedDocs")) || {};
      uploadedDocs[email] = (uploadedDocs[email] || 0) + 1;
      localStorage.setItem("uploadedDocs", JSON.stringify(uploadedDocs));
    }

  } else {
    alert("Please upload a valid PDF file.");
  }
};

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const fetchSavedSignatures = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/signatures?documentId=${documentId}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        if (Array.isArray(data)) setSavedSignatures(data);
        else setSavedSignatures([]);
      } catch (err) {
        console.error("Fetch failed", err);
        setSavedSignatures([]);
      }
    };
    if (pdfFile) fetchSavedSignatures();
  }, [currentPage, pdfFile]);

  const handleSaveSignature = async () => {
    if (!signature.name) return alert("Please type your signature.");
    const payload = {
      documentId,
      x: position.x,
      y: position.y,
      page: currentPage,
      font: signature.fontClass,
      text: signature.name,
    };
    try {
      const res = await fetch("http://localhost:5000/api/signatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signature saved!");
        setSavedSignatures((prev) => [...prev, { ...payload, _id: data._id }]);
        setSignature({ name: "", fontClass: "" });
      }
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDrag = (e, data) => setPosition({ x: data.x, y: data.y });

  const handleSavedDragStop = async (id, data) => {
    try {
      await fetch(`http://localhost:5000/api/signatures/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ x: data.x, y: data.y }),
      });
    } catch (err) {
      console.error("Update position failed", err);
    }
  };

  const handleDownloadFullPDF = async () => {
    if (!pdfFile || !numPages) return;
    const pdf = new jsPDF();

    for (let page = 1; page <= numPages; page++) {
      setCurrentPage(page);
      await new Promise((r) => setTimeout(r, 800));
      const container = document.getElementById("pdf-capture");
      const canvas = await html2canvas(container);
      const imgData = canvas.toDataURL("image/png");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      if (page > 1) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
    }

    const pdfBlob = pdf.output("blob");
    const formData = new FormData();
    formData.append("pdf", pdfBlob, "signed-document.pdf");

    try {
      const uploadRes = await fetch("http://localhost:5000/api/upload/upload-signed-pdf", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: formData,
});
      const uploadData = await uploadRes.json();
      if (uploadRes.ok) {
        alert("Signed PDF uploaded to server ✅");
        localStorage.setItem("signedFilename", uploadData.filename);
      const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;
  if (email) {
    let signedDocs = JSON.parse(localStorage.getItem("signedDocs")) || {};
    signedDocs[email] = (signedDocs[email] || 0) + 1;
    localStorage.setItem("signedDocs", JSON.stringify(signedDocs));
  }
} else {
        alert(uploadData.error || "Upload failed ❌");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDownloadFromServer = async () => {
    const filename = localStorage.getItem("signedFilename");
    if (!filename) return alert("No signed file found. Please sign and upload first.");
    try {
      const response = await fetch(`http://localhost:5000/signed/${filename}`);
      if (!response.ok) throw new Error("Failed to fetch file");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed ❌");
    }
  };

  const handleSendEmail = async () => {
    const filename = localStorage.getItem("signedFilename");
    if (!filename) return alert("Please upload the signed PDF before emailing.");
    try {
      const res = await fetch("http://localhost:5000/api/email/send-signed-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToSend, filename }),
      });
      const data = await res.json();
      if (res.ok) alert("PDF sent to email ✅");
      else alert(data.error || "Failed to send email.");
    } catch (err) {
      console.error("Error occurred:", err);
    }
  };

  return (
    <div className="flex flex-row min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-xl shadow-lg">
      <div className="w-2/3 p-4 flex flex-col items-center">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        {numPages && (
          <div className="flex items-center space-x-4 mt-4 bg-blue-100 px-4 py-2 rounded shadow">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="flex items-center gap-1">
              <ArrowLeftIcon className="w-4 h-4" /> Previous
            </button>
            <p className="font-semibold">Page {currentPage} of {numPages}</p>
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, numPages))} className="flex items-center gap-1">
              Next <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {pdfFile && (
          <div ref={pdfRef} id="pdf-capture" className="relative mt-4 border shadow-md">
            <PdfPreview file={pdfFile} pageNumber={currentPage} onLoadSuccess={onDocumentLoadSuccess} />
            {savedSignatures
              .filter((sig) => sig.page === currentPage)
              .map((sig) => (
                <Draggable key={sig._id} defaultPosition={{ x: sig.x, y: sig.y }} onStop={(e, d) => handleSavedDragStop(sig._id, d)}>
                  <div className={`absolute ${sig.font} text-xl px-2 py-1 cursor-move`} style={{ zIndex: 10 }}>
                    {sig.text}
                  </div>
                </Draggable>
              ))}

            {signature.name && (
              <Draggable onStop={handleDrag}>
                <div className={`absolute top-0 left-0 text-2xl ${signature.fontClass}`} style={{ color: "#2c2c2c", cursor: "move" }}>
                  {signature.name}
                </div>
              </Draggable>
            )}
          </div>
        )}
      </div>

      <div className="w-1/4 p-6 bg-gray-100 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4">Type Your Signature</h2>
          <SignatureInput onChange={setSignature} />
          {signature.name && (
            <>
              <div className={`mt-4 p-2 border rounded text-2xl ${signature.fontClass}`}>Preview: {signature.name}</div>
              <button className="mt-4 px-4 py-2 bg-blue-400 text-white rounded w-full" onClick={handleSaveSignature}>
                Save Signature
              </button>
            </>
          )}
        </div>

        <button className="3mt-6 px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center gap-2" onClick={handleDownloadFullPDF}>
          <PenLine className="w-5 h-5" /> Sign Document
        </button>

        <button className="mt-2 px-2 py-2 bg-blue-900 text-white rounded flex items-center justify-center gap-2" onClick={handleDownloadFromServer}>
          <DownloadIcon className="w-5 h-5" /> Download Signed PDF
        </button>

        <input type="email" placeholder="Enter email to send" value={emailToSend} onChange={(e) => setEmailToSend(e.target.value)} className="mt-4 px-3 py-2 border rounded w-full" />
        <button className="mt-2 px-2 py-2 bg-purple-700 text-white rounded w-full" onClick={handleSendEmail}>
          Send Signed PDF to Email
        </button>
      </div>
    </div>
  );
};

export default Upload;