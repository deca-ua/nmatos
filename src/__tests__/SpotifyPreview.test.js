import React from "react";
import { render, screen } from "@testing-library/react";
import SpotifyPreview from "../components/SpotifyPreview";

describe("SpotifyPreview", () => {
  test("renders audio element with the correct src when previewUrl is provided", () => {
    const previewUrl = "https://example.com/preview.mp3";
    render(<SpotifyPreview previewUrl={previewUrl} />);

    // Query for the audio element by tag name instead of role
    const audioElement = screen.getByTestId("audio-element");
    expect(audioElement).toBeInTheDocument();
    expect(audioElement).toHaveAttribute("src", previewUrl);
  });

  test('renders "No preview available" message when no previewUrl is provided', () => {
    render(<SpotifyPreview previewUrl="" />);

    const messageElement = screen.getByText(/no preview available/i);
    expect(messageElement).toBeInTheDocument();
  });
});
