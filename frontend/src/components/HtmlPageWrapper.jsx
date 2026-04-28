import React, { useEffect } from 'react';

const HtmlPageWrapper = ({ htmlPath }) => {
  const [htmlContent, setHtmlContent] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const iframeRef = React.useRef(null);

  useEffect(() => {
    // Load HTML file and serve it in an iframe
    const loadHtmlPage = async () => {
      try {
        const response = await fetch(htmlPath);
        const html = await response.text();
        
        // Create a blob from HTML content with proper base URL
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        if (iframeRef.current) {
          iframeRef.current.src = url;
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading HTML page:', error);
        setLoading(false);
      }
    };

    loadHtmlPage();

    return () => {
      if (iframeRef.current?.src) {
        URL.revokeObjectURL(iframeRef.current.src);
      }
    };
  }, [htmlPath]);

  return (
    <div style={{ width: '100%', height: '100vh', border: 'none' }}>
      {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}
      <iframe
        ref={iframeRef}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: loading ? 'none' : 'block'
        }}
        title="HTML Page"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      />
    </div>
  );
};

export default HtmlPageWrapper;
