import React, { useState } from 'react';
import './Articles.css'; // Import the CSS file for styling

const Articles = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openFullscreen = (pdfWrapperId, pdfUrl) => {
    const pdfWrapper = document.getElementById(pdfWrapperId);
    const iframe = pdfWrapper.getElementsByTagName('iframe')[0];
    iframe.src = `${pdfUrl}#zoom=100`; // Set zoom to 100% when in fullscreen

    if (pdfWrapper.requestFullscreen) {
      pdfWrapper.requestFullscreen().then(() => setIsFullscreen(true));
    } else if (pdfWrapper.webkitRequestFullscreen) { /* Safari */
      pdfWrapper.webkitRequestFullscreen().then(() => setIsFullscreen(true));
    } else if (pdfWrapper.msRequestFullscreen) { /* IE11 */
      pdfWrapper.msRequestFullscreen().then(() => setIsFullscreen(true));
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        document.querySelectorAll('iframe').forEach(iframe => {
          const src = iframe.src.split('#')[0]; // Remove zoom parameter
          iframe.src = `${src}#zoom=36`; // Reset zoom to 36% when exiting fullscreen
        });
      });
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen().then(() => setIsFullscreen(false));
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div className="articles-container">
      <h1 className={isFullscreen ? "title-lowered" : ""}>FEATURED ARTICLES</h1>
      <div className="pdf-gallery">
        <div className="pdf-viewer" id="pdfWrapper1">
          <iframe
            title="Instant Gratification Article"
            src="Instantgratification.pdf#zoom=36"
            frameBorder="0"
            allow="fullscreen"
          ></iframe>
          {!isFullscreen && (
            <button className="fullscreen-button" onClick={() => openFullscreen('pdfWrapper1', 'Instantgratification.pdf')}>Fullscreen</button>
          )}
          {isFullscreen && (
            <button className="go-back-button" onClick={exitFullscreen}>Go Back</button>
          )}
        </div>
        <div className="pdf-viewer" id="pdfWrapper2">
          <iframe
            title="Algorithm Bias Article"
            src="articlealgobias.pdf#zoom=36"
            frameBorder="0"
            allow="fullscreen"
          ></iframe>
          {!isFullscreen && (
            <button className="fullscreen-button" onClick={() => openFullscreen('pdfWrapper2', 'articlealgobias.pdf')}>Fullscreen</button>
          )}
          {isFullscreen && (
            <button className="go-back-button" onClick={exitFullscreen}>Go Back</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
