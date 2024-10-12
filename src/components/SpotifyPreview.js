import React from "react";
import PropTypes from 'prop-types';

const SpotifyPreview = ({ previewUrl }) => {
  return (
    <div className="col-6">
      {previewUrl ? (
        <audio controls src={previewUrl} className="w-100 mt-3" />
      ) : (
        <p className="text-muted">No preview available</p>
      )}
    </div>
  );
};

SpotifyPreview.propTypes = {
  previewUrl: PropTypes.string.isRequired,
};

export default SpotifyPreview;
