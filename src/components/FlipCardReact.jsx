import { useState } from 'react';

export default function FlipCardReact({ word }) {
  const [clickCount, setClickCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPinyinVisible, setIsPinyinVisible] = useState(false);

  const handleClick = () => {
    if (clickCount === 0) {
      // First click: Show pinyin
      setIsPinyinVisible(true);
      setClickCount(1);
    } else if (clickCount === 1) {
      // Second click: Flip to English
      setIsFlipped(true);
      setClickCount(2);
    } else {
      // Third click: Reset
      setIsPinyinVisible(true);
      setIsFlipped(false);
      setClickCount(1);
    }
  };

  return (
    <div 
      className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
      onClick={handleClick}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <h2>{word.chinese}</h2>
          <p className={`pinyin ${isPinyinVisible ? '' : 'hidden'}`}>
            {word.pinyin}
          </p>
        </div>
        <div className="flip-card-back">
          <p>{word.english}</p>
        </div>
      </div>
    </div>
  );
} 