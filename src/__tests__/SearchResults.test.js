import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchResults from '../components/SearchResults'; // Ensure this path is correct

describe('SearchResults', () => {
  it('renders lyrics correctly', () => {
    const mockLyrics = 'Here are some sample lyrics.';
    const mockPreviewUrl = 'http://example.com/audio.mp3';

    render(<SearchResults lyrics={mockLyrics} searched={true} previewUrl={mockPreviewUrl} />);

    const lyricsElement = screen.getByText(mockLyrics);
    expect(lyricsElement).toBeInTheDocument(); // Check if the lyrics are rendered

    const audioElement = screen.getByTestId('audio-element');
    expect(audioElement).toBeInTheDocument(); // Check if the audio element is rendered
    expect(audioElement).toHaveAttribute('src', mockPreviewUrl); // Check the audio source URL
  });

  it('displays "No preview available" when searched is true and previewUrl is not provided', () => {
    const mockLyrics = 'Here are some sample lyrics.';

    render(<SearchResults lyrics={mockLyrics} searched={true} previewUrl={undefined} />);

    const noPreviewElement = screen.getByText('No preview available');
    expect(noPreviewElement).toBeInTheDocument(); // Check if "No preview available" message is displayed
  });
});
