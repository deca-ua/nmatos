import React from 'react';
import PropTypes from 'prop-types';

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

SearchResults.propTypes = {
  lyrics: PropTypes.string.isRequired,
  searched: PropTypes.bool.isRequired,
  previewUrl: PropTypes.string.isRequired,
};

export default SearchResults;
