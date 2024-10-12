import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // If you have additional custom CSS
import { useState, useEffect } from "react";
import Axios from "axios"; // Import Axios
import { getSpotifyToken, searchSpotifyTrack } from "./spotifyService";
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import React from "react";


function App() {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [artistOptions, setArtistOptions] = useState([]);
  const [songOptions, setSongOptions] = useState([]);
  const [spotifyToken, setSpotifyToken] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searched, setSearched] = useState(false); // New state to track if search has been initiated

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getSpotifyToken();
      setSpotifyToken(token);
    };
    fetchToken();
  }, []);

  const fetchArtistSuggestions = async (input) => {
    if (!input) return; // Prevent fetching if the input is empty
    try {
      const response = await Axios.get(
        `https://api.lyrics.ovh/suggest/${input}`
      );
      const uniqueArtists = new Set(
        response.data.data.map((item) => item.artist.name)
      ); // Filter duplicates
      setArtistOptions(
        [...uniqueArtists].map((artist) => ({
          value: artist,
          label: artist,
        }))
      );
    } catch (error) {
      console.error("Error fetching artist suggestions:", error);
    }
  };

  const fetchSongsForArtist = async (artistName) => {
    try {
      const response = await Axios.get(
        `https://api.lyrics.ovh/suggest/${artistName}`
      );
      const songList = response.data.data.map((item) => ({
        value: item.title,
        label: item.title,
      }));
      setSongOptions(songList); // Update the song options
    } catch (error) {
      console.error("Error fetching songs for artist:", error);
    }
  };
  

  const handleSearch = async () => {
    setSearched(true); // Mark that a search has been performed
    await searchLyrics();
    await searchSpotifyPreview();
  };

  const searchLyrics = async () => {
    if (artist === "" || song === "") {
      return;
    }

    setLoading(true);
    setLyrics("");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://api.lyrics.ovh/v1/${artist}/${song}`,
        {
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data && data.lyrics) {
        setLyrics(data.lyrics);
      } else {
        setLyrics("Lyrics not found. Please check the artist and song name.");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        setLyrics("No lyrics were found. Please try again.");
      } else {
        console.error("Error fetching lyrics:", error);
        setLyrics("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const searchSpotifyPreview = async () => {
    if (!spotifyToken || !artist || !song) return;

    try {
      let track = await searchSpotifyTrack(spotifyToken, artist, song);

      if (!track) {
        const newToken = await getSpotifyToken();
        setSpotifyToken(newToken);
        track = await searchSpotifyTrack(newToken, artist, song);
      }

      if (track && track.preview_url) {
        setPreviewUrl(track.preview_url);
      } else {
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Error fetching Spotify track preview:", error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="bg-white rounded shadow p-4 w-100"
        style={{ maxWidth: "600px" }}
      >
        <h1 className="text-center text-danger mb-4">Lyrics Finder</h1>

        <SearchForm
          artist={artist}
          setArtist={setArtist}
          song={song}
          setSong={setSong}
          artistOptions={artistOptions}
          songOptions={songOptions}
          fetchArtistSuggestions={fetchArtistSuggestions}
          fetchSongsForArtist={fetchSongsForArtist}
          setSongOptions={setSongOptions} // Pass setSongOptions here
          setLyrics={setLyrics} // Pass setLyrics here
          setPreviewUrl={setPreviewUrl} // Pass setPreviewUrl here
          setArtistOptions={setArtistOptions} // Pass setArtistOptions here
          loading={loading}
          handleSearch={handleSearch}
        />

        <hr />

        <SearchResults
          lyrics={lyrics}
          searched={searched}
          previewUrl={previewUrl}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
