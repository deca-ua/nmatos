import React from 'react';

const SearchResults = ({ lyrics, searched, previewUrl }) => {
  return (
    <div className="row">
      <div className="col-6">
        <pre className="text-lg text-primary whitespace-pre-wrap">
          {lyrics}
        </pre>
      </div>

      <div className="col-6">
        {searched && (
          previewUrl ? (
            <audio controls src={previewUrl} className="w-100 mt-3" />
          ) : (
            <p className="text-muted">No preview available</p>
          )
        )}
      </div>
    </div>
  );
};

export default SearchResults;
