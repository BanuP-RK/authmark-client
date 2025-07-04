// src/components/PdfPreview.jsx
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfPreview = ({ file, pageNumber, onLoadSuccess }) => {
  return (
    <div className="shadow-md border rounded p-4">
      <Document
        file={file}
        onLoadSuccess={onLoadSuccess}
        loading={<p>Loading PDF...</p>}
        error={<p>Failed to load PDF</p>}
      >
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  );
};

export default PdfPreview;
