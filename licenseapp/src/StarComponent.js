import React, { useState, useEffect } from 'react';
import { Motion, spring } from 'react-motion';

const starCount = 100;

const StarComponent = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const initialStars = Array.from({ length: starCount }, (_, index) => ({
    id: index,
    x: Math.random() * screenWidth,
    y: Math.random() * screenHeight,
    size: Math.random() * 2, 
    opacity: Math.random(), 
    velocityX: (Math.random() - 0.5) * 0.5, 
    velocityY: (Math.random() - 0.5) * 0.5, 
  }));

  const [stars, setStars] = useState(initialStars);

  useEffect(() => {
    const updateStars = () => {
      setStars(prevStars => {
        return prevStars.map(star => {
          let newVelocityX = star.velocityX;
          let newVelocityY = star.velocityY;

          if (star.x <= 0 || star.x >= screenWidth) {
            newVelocityX *= -1;
          }
          if (star.y <= 0 || star.y >= screenHeight) {
            newVelocityY *= -1;
          }

          return {
            ...star,
            x: (star.x + newVelocityX + screenWidth) % screenWidth,
            y: (star.y + newVelocityY + screenHeight) % screenHeight,
            velocityX: newVelocityX,
            velocityY: newVelocityY,
          };
        });
      });
    };

    const intervalId = setInterval(updateStars, 1000 / 30); 

    return () => clearInterval(intervalId);
  }, [screenWidth, screenHeight]);

  return (
    <>
      {stars.map(star => (
        <Motion key={star.id} defaultStyle={{ x: star.x, y: star.y }} style={{ x: spring(star.x), y: spring(star.y) }}>
          {style => (
            <div
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                background: '#fff',
                boxShadow: `0 0 ${star.size * 0.5}px rgba(255, 255, 255, ${star.opacity})`, 
                position: 'absolute',
                transform: `translate(${style.x}px, ${style.y}px)`,
              }}
            />
          )}
        </Motion>
      ))}
    </>
  );
}

export default StarComponent;
