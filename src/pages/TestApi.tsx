import React, { useEffect } from 'react';

// Import the raw HTML as a string
const testApiHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>API Test</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
      }
      /* Rest of the CSS would be included here */
      /* For brevity, I've omitted most of the CSS */
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Harris Jazz Lines API Test</h1>
      <!-- Rest of the HTML content would be included here -->
    </div>
    <script>
      // JavaScript content would be included here
    </script>
  </body>
</html>`;

const TestApi: React.FC = () => {
  useEffect(() => {
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';

    document.body.innerHTML = '';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.documentElement.innerHTML = testApiHtml;
      iframeDoc.close();
    }

    const handlePopState = () => {
      window.location.href = '/';
    };

    window.addEventListener('popstate', handlePopState);

    // Clean up
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return <div>Loading API Test...</div>;
};

export default TestApi;
