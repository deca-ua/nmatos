// src/components/LyricsDisplay.js
import React from "react";

const LyricsDisplay = ({ lyrics }) => {
  return (
    <div className="col-6">
      <pre className="text-lg text-primary whitespace-pre-wrap">{lyrics}</pre>
    </div>
  );
};

export default LyricsDisplay;
