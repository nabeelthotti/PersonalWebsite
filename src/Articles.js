import React, { useState } from 'react';
import './Articles.css';

const articlesData = [
  {
    id: 1,
    title: 'Instant Gratification: The Modern Dilemma',
    description: 'A deep dive into how instant gratification is shaping our society, technology, and personal habits.',
    pdf: 'Instantgratification.pdf',
  },
  {
    id: 2,
    title: 'Algorithmic Bias: The Hidden Danger',
    description: 'Exploring the risks and realities of bias in algorithms and what it means for fairness in the digital age.',
    pdf: 'articlealgobias.pdf',
  },
];

const Articles = () => {
  const [openArticle, setOpenArticle] = useState(null);

  const handleOpen = (article) => {
    setOpenArticle(article);
  };

  const handleClose = () => {
    setOpenArticle(null);
  };

  return (
    <div className="articles-container">
      <h1 className="articles-title">Articles & Essays</h1>
      <p className="articles-subtitle">A collection of my thoughts, essays, and explorations</p>
      <div className="articles-grid">
        {articlesData.map((article) => (
          <div className="article-card" key={article.id}>
            <div className="article-content">
              <h2>{article.title}</h2>
              <div className="article-description">{article.description}</div>
              <button className="read-button" onClick={() => handleOpen(article)}>
                Read
              </button>
            </div>
          </div>
        ))}
      </div>
      {openArticle && (
        <div className="article-modal" onClick={handleClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={handleClose}>&times;</button>
            <h2>{openArticle.title}</h2>
            <iframe
              src={openArticle.pdf}
              title={openArticle.title}
              frameBorder="0"
              width="100%"
              height="500px"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;
