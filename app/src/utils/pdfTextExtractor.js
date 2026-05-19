import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MIN_EXTRACTED_TEXT_LENGTH = 100;
const PDF_MIME_TYPE = "application/pdf";
const PDF_EXTENSION_PATTERN = /\.pdf$/i;
const PDF_MAGIC_HEADER = "%PDF-";

function ensureReadableStreamAsyncIterationCompatibility() {
  if (typeof ReadableStream === "undefined") return;

  const prototype = ReadableStream.prototype;

  // Safari/iOS compatibility shim for pdf.js text extraction. Some iOS
  // versions expose ReadableStream without values()/async iteration support.
  if (typeof prototype.values !== "function") {
    Object.defineProperty(prototype, "values", {
      configurable: true,
      writable: true,
      value: async function* values() {
        const reader = this.getReader();

        try {
          while (true) {
            const result = await reader.read();

            if (result.done) {
              return;
            }

            yield result.value;
          }
        } finally {
          reader.releaseLock();
        }
      },
    });
  }

  if (typeof prototype[Symbol.asyncIterator] !== "function") {
    Object.defineProperty(prototype, Symbol.asyncIterator, {
      configurable: true,
      writable: true,
      value: prototype.values,
    });
  }
}

function hasPdfMimeType(file) {
  return file.type === PDF_MIME_TYPE;
}

function hasPdfExtension(file) {
  return PDF_EXTENSION_PATTERN.test(file.name || "");
}

function hasPdfMagicHeader(arrayBuffer) {
  const headerBytes = new Uint8Array(
    arrayBuffer,
    0,
    Math.min(PDF_MAGIC_HEADER.length, arrayBuffer.byteLength)
  );
  const headerText = String.fromCharCode(...headerBytes);

  return headerText === PDF_MAGIC_HEADER;
}

function getFileMetadata(file, extra = {}) {
  return {
    fileName: file?.name || "",
    fileType: file?.type || "",
    fileSize: Number.isFinite(file?.size) ? file.size : null,
    extensionMatch: file ? hasPdfExtension(file) : false,
    mimeMatch: file ? hasPdfMimeType(file) : false,
    ...extra,
  };
}

function createPdfExtractionError(code, message, debugDetails = {}) {
  const error = new Error(message);
  error.code = code;
  error.debugDetails = debugDetails;
  return error;
}

function isPdfFile(file, arrayBuffer) {
  return (
    hasPdfMimeType(file) ||
    hasPdfExtension(file) ||
    hasPdfMagicHeader(arrayBuffer)
  );
}

export async function extractTextFromPdf(file) {
  if (!file) {
    throw createPdfExtractionError(
      "invalid_file_type",
      "No PDF file provided.",
      getFileMetadata(file)
    );
  }

  let arrayBuffer;

  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (error) {
    throw createPdfExtractionError(
      "array_buffer_failed",
      "Could not read the selected file.",
      getFileMetadata(file, {
        originalErrorMessage: error.message || String(error),
      })
    );
  }

  const magicHeaderMatch = hasPdfMagicHeader(arrayBuffer);
  const validationMetadata = getFileMetadata(file, {
    magicHeaderMatch,
    byteLength: arrayBuffer.byteLength,
  });

  if (!isPdfFile(file, arrayBuffer)) {
    throw createPdfExtractionError(
      "invalid_file_type",
      "Invalid file type. Please upload a PDF file, or paste your CV text manually.",
      validationMetadata
    );
  }

  ensureReadableStreamAsyncIterationCompatibility();

  let pdf;

  try {
    pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;
  } catch (error) {
    throw createPdfExtractionError(
      "pdfjs_load_failed",
      "Unreadable or corrupt PDF. Please try a different PDF or paste your CV text manually.",
      {
        ...validationMetadata,
        originalErrorMessage: error.message || String(error),
      }
    );
  }

  const pageTexts = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    try {
      ensureReadableStreamAsyncIterationCompatibility();

      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item) => item.str)
        .join(" ")
        .trim();

      if (pageText) {
        pageTexts.push(pageText);
      }
    } catch (error) {
      throw createPdfExtractionError(
        "page_text_failed",
        "Could not extract text from one of the PDF pages.",
        {
          ...validationMetadata,
          pageCount: pdf.numPages,
          failedPageNumber: pageNumber,
          originalErrorMessage: error.message || String(error),
        }
      );
    }
  }

  const fullText = pageTexts.join("\n\n").trim();

  if (!fullText || fullText.length < MIN_EXTRACTED_TEXT_LENGTH) {
    throw createPdfExtractionError(
      "no_extractable_text",
      "No extractable text found. This PDF may be image-based or scanned.",
      {
        ...validationMetadata,
        pageCount: pdf.numPages,
        extractedCharacterCount: fullText.length,
        minimumExtractedTextLength: MIN_EXTRACTED_TEXT_LENGTH,
      }
    );
  }

  return {
    text: fullText,
    pageCount: pdf.numPages,
    characterCount: fullText.length,
  };
}
