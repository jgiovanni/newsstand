let PdfViewer = require('pdfviewer');

let pdfConfig = {
  pdfUrl: '/pdfs/20180425TD.pdf',
  download: false,
  staticHost: window.location.origin,
  onerror: handlePdfError,
};

let handlePdfError = function (a) {
  console.error(a);
};

// new PdfViewer(pdfConfig).embed(document.getElementById('DocContainer'));

// PdfViewer