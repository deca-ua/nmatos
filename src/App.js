import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // If you have additional custom CSS
import { useState, useEffect } from "react";
import Axios from "axios"; // Import Axios
import { getSpotifyToken, searchSpotifyTrack } from "./spotifyService";
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import React from "react";
import process from "process";

function App() {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [artistOptions, setArtistOptions] = useState([]);
  const [songOptions, setSongOptions] = useState([]);
  const [spotifyToken, setSpotifyToken] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState({}); // Initialize to an empty object, not null

  const YOUR_SPACE_ID = process.env.REACT_APP_YOUR_SPACE_ID;
  const YOUR_ACCESS_TOKEN = process.env.REACT_APP_YOUR_ACCESS_TOKEN;

  // This effect should always run, regardless of `page` being present or not
  useEffect(() => {
    const query = `{
      blogPostCollection {
        items {
          title
          artist
          albumName
          releaseDate
          content {
            json
          }
          featuredImage {
            url
          }
        }
      }
    }`;

    window
      .fetch(
        `https://graphql.contentful.com/content/v1/spaces/${YOUR_SPACE_ID}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${YOUR_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({ query }),
        },
      )
      .then((response) => response.json())
      .then(({ data, errors }) => {
        if (errors) {
          console.error(errors);
        } else if (data && data.blogPostCollection) {
          setPage(data.blogPostCollection.items[0]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  });

  // This effect also runs unconditionally
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getSpotifyToken();
      setSpotifyToken(token);
    };
    fetchToken();
  }, []);

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
        `https://api.lyrics.ovh/suggest/${input}`,
      );
      const uniqueArtists = new Set(
        response.data.data.map((item) => item.artist.name),
      ); // Filter duplicates
      setArtistOptions(
        [...uniqueArtists].map((artist) => ({
          value: artist,
          label: artist,
        })),
      );
    } catch (error) {
      console.error("Error fetching artist suggestions:", error);
    }
  };

  const fetchSongsForArtist = async (artistName) => {
    try {
      const response = await Axios.get(
        `https://api.lyrics.ovh/suggest/${artistName}`,
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
      const rowTop = document.getElementById("rowTop");

      const response = await fetch(
        `https://api.lyrics.ovh/v1/${artist}/${song}`,
        {
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data && data.lyrics) {
        setLyrics(data.lyrics);
        rowTop.classList.remove("align-items-center");
        rowTop.classList.add("align-items-start");
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
    <div className="container">
      <div
        id="rowTop"
        className="row align-items-center justify-content-around bg-light"
        style={{ minHeight: "100vh" }}
      >
        <div className="col-6 d-flex flex-column justify-content-center">
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
              setSongOptions={setSongOptions}
              setLyrics={setLyrics}
              setPreviewUrl={setPreviewUrl}
              setArtistOptions={setArtistOptions}
              loading={loading}
              handleSearch={handleSearch}
              setAlignment={(alignment) => {
                const rowTop = document.getElementById("rowTop");
                rowTop.classList.remove("align-items-start");
                rowTop.classList.add(alignment);
              }}
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
        <div className="col-6 d-flex align-items-start">
          {/* Album blog post styled section */}
          {page && (
            <div
              className="bg-white rounded shadow p-4 w-100"
              style={{ maxWidth: "600px" }}
            >
              <h2 className="text-primary mb-3">{page.title}</h2>

              {page.featuredImage && (
                <div className="text-center mb-4">
                  <img
                    src={page.featuredImage.url}
                    alt={page.title}
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: "400px", objectFit: "cover" }}
                  />
                </div>
              )}

              <p className="text-muted">
                <strong>Artist:</strong> {page.artist} | <strong>Album:</strong>{" "}
                {page.albumName} | <strong>Release Date:</strong>{" "}
                {page.releaseDate}
              </p>

              {/* Styled content of the post */}
              {page.content?.json ? (
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: page.content.json }}
                />
              ) : (
                <p>No content available for this album.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
