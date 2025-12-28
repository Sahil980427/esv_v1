import React from "react";

const Preloader = () => {
  return (
    <div className="preloader-container">
      {/* You can change "LOADING" to your brand name "EditSpaceVisuals" if preferred */}
      <h2 className="loading-text">LOADING</h2>
      <div className="spinner"></div>
    </div>
  );
};

export default Preloader;
