// src/components/SpotifyPreview.js
import React from "react";

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

export default SpotifyPreview;
