import { useDropzone } from "react-dropzone";

function PdfUploadBox({ onFileSelected, disabled = false }) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
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
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
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

      {fileRejections.length > 0 && (
        <p className="status warning">
          Please upload a PDF file only.
        </p>
      )}
    </div>
  );
}

export default PdfUploadBox;
