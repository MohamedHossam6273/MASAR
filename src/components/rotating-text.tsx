'use client';

import { useState, useEffect } from 'react';

type RotatingTextProps = {
  texts: string[];
  interval?: number;
};

export function RotatingText({ texts, interval = 5000 }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <p key={currentIndex} className="animate-fade-in-slow">
      {texts[currentIndex]}
    </p>
  );
}
