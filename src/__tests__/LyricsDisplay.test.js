import React from 'react';
import { render, screen } from '@testing-library/react';
import LyricsDisplay from '../components/LyricsDisplay'; // Adjust the path as necessary

describe('LyricsDisplay', () => {
  it('renders the lyrics correctly', () => {
    const mockLyrics = "These are the lyrics of the song."; // Sample lyrics

    render(<LyricsDisplay lyrics={mockLyrics} />);

    const lyricsElement = screen.getByText(mockLyrics);
    expect(lyricsElement).toBeInTheDocument(); // Check if the lyrics are rendered
  });

  it('renders an empty pre element when lyrics are empty', () => {
    const { container } = render(<LyricsDisplay lyrics="" />); // Render with empty lyrics

    const preElement = container.querySelector('pre'); // Get the <pre> element directly
    expect(preElement).toBeInTheDocument(); // Check if the <pre> element is rendered
    expect(preElement).toHaveTextContent(''); // Check if it's empty
  });
});
