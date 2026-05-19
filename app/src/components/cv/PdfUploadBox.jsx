import { useState } from "react";
import { useDropzone } from "react-dropzone";

const REJECTED_FILE_MESSAGE =
  "This file was not accepted as a PDF. On mobile, try selecting the PDF from Files, or paste your CV text manually.";

function looksLikePdf(file) {
  return (
    file?.type === "application/pdf" ||
    /\.pdf$/i.test(file?.name || "")
  );
}

function PdfUploadBox({ onFileSelected, disabled = false }) {
  const [rejectionMessage, setRejectionMessage] = useState("");

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
  } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    disabled,
    noClick: true,
    noKeyboard: true,
    onDropAccepted: (acceptedFiles) => {
      setRejectionMessage("");

      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      const rejectedFile = fileRejections[0]?.file;

      if (looksLikePdf(rejectedFile)) {
        setRejectionMessage("");
        onFileSelected(rejectedFile);
        return;
      }

      setRejectionMessage(REJECTED_FILE_MESSAGE);
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={isDragActive ? "pdf-upload-box active" : "pdf-upload-box"}
      >
        <input {...getInputProps()} />

        <p>
          <strong>Upload your CV / resume as PDF</strong>
        </p>

        <p>
          {isDragActive
            ? "Drop the PDF here..."
            : "Drag and drop a PDF here, or use the button below."}
        </p>

        <button
          type="button"
          className="pdf-upload-button"
          onClick={open}
          disabled={disabled}
        >
          Choose PDF file
        </button>

        <p className="helper-text">
          PDF only for this MVP. You will be able to review the extracted text before saving.
        </p>
      </div>

      {rejectionMessage && (
        <p className="status warning">
          {rejectionMessage}
        </p>
      )}
    </div>
  );
}

export default PdfUploadBox;
