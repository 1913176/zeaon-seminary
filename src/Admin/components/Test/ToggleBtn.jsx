import React from 'react';
import './ToggleBtn.css';

const ToggleBtn = ({ leftValue, RightValue, currentValue, handleToggle }) => {
  const handleToggleChange = () => {
    console.log(currentValue)
    if (currentValue.type === leftValue.type) {
      handleToggle(RightValue);
    } else if (currentValue.type === RightValue.type) {
      handleToggle(leftValue);
    }
  };
  return (
    <div className="toggle-btn" onClick={()=>handleToggleChange()}>
      <div
        className="btn-circle"
        style={{
          transform: `translateX(${currentValue.type === leftValue.type ? '0.25rem' : '2.15rem'})`,
        }}
      />
    </div>
  );
};

export default ToggleBtn;
