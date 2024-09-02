import React, { useState } from 'react';
import './Articles.css';

const Articles = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = (pdfWrapperId) => {
    const pdfWrapper = document.getElementById(pdfWrapperId);
    if (!document.fullscreenElement) {
      if (pdfWrapper.requestFullscreen) {
        pdfWrapper.requestFullscreen().then(() => setIsFullscreen(true));
      } else if (pdfWrapper.webkitRequestFullscreen) {
        pdfWrapper.webkitRequestFullscreen().then(() => setIsFullscreen(true));
      } else if (pdfWrapper.msRequestFullscreen) {
        pdfWrapper.msRequestFullscreen().then(() => setIsFullscreen(true));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen().then(() => setIsFullscreen(false));
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  return (
    <div className="articles-container">
      <div className="pdf-gallery">
        <div className="pdf-viewer" id="pdfWrapper1">
          <iframe
            title="Instant Gratification Article"
            src="Instantgratification.pdf#toolbar=0&view=FitH"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <button className="fullscreen-button" onClick={() => toggleFullscreen('pdfWrapper1')}>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
        <div className="pdf-viewer" id="pdfWrapper2">
          <iframe
            title="Algorithm Bias Article"
            src="articlealgobias.pdf#toolbar=0&view=FitH"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <button className="fullscreen-button" onClick={() => toggleFullscreen('pdfWrapper2')}>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Articles;
