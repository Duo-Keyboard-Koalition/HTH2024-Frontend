'use client';
import { useState, useEffect } from 'react';
import './styles.css'; // Import the CSS file
function TextBoxPage() {
    const words = [
        'annoyed', 
        'salty', 
        'jealous', 
        'envy', 
        'superficial',
        'irritated',
        'resentful',
        'bitter',
        'frustrated',
        'spiteful',
        'pettiness',
        'disgruntled',
        'insecure',
        'covetous',
        'vindictive'
      ];
      
    // get a random word from the list
    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
      }
      
  const [word, setWord] = useState('jealous');
  const [animationClass, setAnimationClass] = useState('fall-from-above');
  
  let currentWordIndex = 0;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationClass('fall-below');
      setTimeout(() => {
        currentWordIndex = (currentWordIndex + 1) % words.length;
        setWord(words[currentWordIndex]);
        setAnimationClass('fall-from-above');
      }, 500); // Match the duration of the fall-below animation
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-sart justify-center h-screen bg-gray-100">
      <div className="text-2xl font-bold text-gray-800">
        <h1>After seeing an instagram reel, tik tok short or any short videos of sorts?</h1>
        
         Have you ever feel <span className={animationClass}>{word}</span>?
      </div>
    </div>
  );
}

export default TextBoxPage;