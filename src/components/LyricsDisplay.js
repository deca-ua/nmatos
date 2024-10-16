import React from "react";
import PropTypes from "prop-types";

const LyricsDisplay = ({ lyrics }) => {
  return (
    <div className="col-6">
      <pre className="text-lg text-primary whitespace-pre-wrap">{lyrics}</pre>
    </div>
  );
};

LyricsDisplay.propTypes = {
  lyrics: PropTypes.string.isRequired,
};

export default LyricsDisplay;
