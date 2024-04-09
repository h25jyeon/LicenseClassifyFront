import React from 'react';
import { Motion, spring } from 'react-motion';

const CustomTooltip = ({ exceptionType }) => {
  const tooltipContents = {
    'A': 'PRODUCT_MATCH',
    'B': 'PUBLISHER_MATCH',
    'C': 'PUBLISHER_EXACT_MATCH',
    'D': 'PUBLISHER_PRODUCT_EXACT_MATCH'
  };

  const showTooltip = Object.keys(tooltipContents).includes(exceptionType);

  return (
    <>
      {console.log(tooltipContents[exceptionType])}
      {showTooltip && (
        <Motion
          defaultStyle={{ opacity: 0 }}
          style={{ opacity: spring(1) }}
        >
          {interpolatingStyle => (
            <div
              style={{
                position: 'relative',
                color: 'var(--default-text-color)',
                opacity: interpolatingStyle.opacity
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--filter-background-color)',
                  borderRadius: '4px',
                  padding: '8px',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  zIndex: '9'
                }}
              >
                <div>{tooltipContents[exceptionType]}</div>
              </div>
            </div>
          )}
        </Motion>
      )}
    </>
  );
};

export default CustomTooltip;
