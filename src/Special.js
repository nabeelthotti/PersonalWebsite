import React, { useState, useEffect } from 'react';
import './Special.css';
import Confetti from 'react-confetti';

const Special = () => {
  // Carousel images
  const images = [
    '/IMG_6735.jpg',
    '/IMG_6736.jpg',
    '/IMG_6737.jpg',
    '/IMG_6738.jpg',
    '/IMG_6739.jpg',
    '/IMG_6740.jpg',
    '/IMG_6741.jpg',
    '/IMG_6742.jpg',
    '/IMG_6743.jpg',
    '/IMG_6730.png',
    '/IMG_6729.png',
    '/IMG_6728.png',
    '/IMG_6727.png',
    '/IMG_6726.png',
    '/IMG_6725.png',
    '/IMG_6724.png',
    '/IMG_6723.png',
    '/IMG_6722.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle letter click
  const handleLetterClick = (e) => {
    e.stopPropagation(); // Prevent any parent handlers
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleEscKey);
    }
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isModalOpen]);

  // Lock screen state
  const [isLocked, setIsLocked] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');

  // Secret password
  const secretPassword = 'daddy'; // Replace with your actual password

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === secretPassword) {
      setIsLocked(false);
      setShowMessage(true); // Display message page
    } else {
      alert('WRONG CODE! \nSELF DESTRUCT IN 5 SECONDS ... 💣');
    }
  };

  // State to control the display of the message page
  const [showMessage, setShowMessage] = useState(false);

  // Handle continue button click
  const handleGiftClick = () => {
    setShowMessage(false); // Proceed to main content
  };

  // Poem lines and display control
  const poemLines = [
    'To My Love,',
    'Though oceans lie between us now,',
    'Your heart feels so near.',
    'Every laugh and whispered vow,',
    'Makes the distance disappear.',
    'Happy Anniversary.',
    ' - نبيل ',
  ];
  const [currentLineIndex, setCurrentLineIndex] = useState(-1); // Start from -1

  // Confetti control
  const [showConfetti, setShowConfetti] = useState(true);

  // Show continue button
  const [showGiftButton, setShowGiftButton] = useState(false);

  // Display each line every 2.5 seconds
  useEffect(() => {
    if (!showMessage) return;

    if (currentLineIndex < poemLines.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLineIndex((prevIndex) => prevIndex + 1);
      }, 2500); // 2.5 seconds
      return () => clearTimeout(timer);
    } else {
      // Stop confetti after all lines are displayed
      setShowConfetti(false);

      // Show continue button after 1 second
      const timer = setTimeout(() => {
        setShowGiftButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, showMessage, poemLines.length]);

  return (
    <div className={`container ${isModalOpen ? 'modal-open' : ''}`}>
      {isLocked ? (
        // Password lock screen
        <div className="password-screen">
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <label htmlFor="password">Enter Code 🔎</label>
            <input
              type="password"
              id="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button type="submit">Reveal Top Secret Assignment 🕵🏽‍♂️</button>
          </form>
        </div>
      ) : showMessage ? (
        // Message page after password is entered
        <div className="message-page">
          {showConfetti && <Confetti />}
          <div className="poem">
            {poemLines.map((line, index) => (
              <p
                key={index}
                className={`line ${index <= currentLineIndex ? 'visible' : ''}`}
              >
                {index === 0 ? <strong>{line}</strong> : line}
              </p>
            ))}
          </div>
          {showGiftButton && (
            <button className="gift-button" onClick={handleGiftClick}>
              Continue
            </button>
          )}
        </div>
      ) : (
        // The main content after clicking continue
        <>
          {/* Carousel Section */}
          <div className="carousel">
            <img src={images[currentIndex]} alt="Carousel" />
          </div>

          {/* Envelope Section */}
          <div className="envelope-wrapper">
            <div className="wrapper">
              <div className="lid one"></div>
              <div className="lid two"></div>
              <div className="envelope"></div>
              <div className="letter" onClick={handleLetterClick}>
                <p>A Message From My Heart</p>
              </div>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={handleCloseModal}>
                  &times;
                </button>
                <div className="modal-content">
  <div className="letter-header">
    Dear Fatima Munir Thotti,
  </div>

  <div className="letter-body">
    <p>
      I know our times are rough. Although these last few months have been so difficult, your presence has given me ease. There is nothing I could write to truly describe my gratitude for you Fatima. You have made my days brighter, and my smile wider. I know I am Beel so let me tell you a little bit about how I feel. Every single day I wake up so excited to text you, so excited to possibly call you, so motivated to give you everything I can today, tomorrow, and the day after. I feel so intense. Such intense emotions of love, that make my heart feel heavier in my chest. It's almost like my emotional love is physical, it has a form of weight. There we go, that's the closest definition we are gonna get. You make me feel love. I actually feel it. I feel it in my stomach when I am about to see you, I feel it in my heart when I miss you, I feel it in my fingertips when I think of you. Your love makes me who I am. If you asked me what I want in this world and the world after, I would tell you that all I want is to show you how I feel. I want to spend everyday, every hour, every minute, every second showing you how much I love you. Whether it be through my words, my actions, my choices, I want to show you how much I love you through them all.
    </p>

    <p>
      Looking back, our memories are genuinely what keeps me going. Being with you constantly made me feel so perfect. It made me feel so whole. I finally felt at peace. My whole world slowed down. It was truly euphoric. Everyday I think 'wow I can not wait to relive those memories after we get married'. I am so excited to live our lives together, to watch the journey we evolve through. I can not express the excitement, I am literally getting jitters as I type this. I know this is no conventional letter, but baby girl, how can I tell you that you're my all? You're my home. You're my soulmate. How can I show you how grateful I am? That's an assignment harder than any stats exam, but I guess here is my attempt.
    </p>

    <p>
      Thank you. Thank you for being the light in a room of darkness. Thank you for always trying to see the best in me. Thank you for always making me laugh. Thank you for always showing me so much love. Thank you for always being so kind. Thank you for making me feel safe. Thank you for making me feel like a kid again. Thank you for making me so happy. Thank you for making my dreams come true. Thank you for teaching me the lessons I needed to learn. Thank you for giving me more when I need more. Thank you for giving me perspective. Thank you for teaching me how to love. Thank you for showing me what love is. Thank you. Thank you for stumbling into my life and staying there permanently. I love you. I love you infinitely. I love you with every subatomic particle in my human body. I love you.
    </p>
  </div>

  <div className="letter-footer">
    <p>Always and Forever,</p>
    <p>[نبيل]</p>
  </div>
</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Special;
