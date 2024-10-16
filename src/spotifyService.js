import Axios from "axios";
import process from "process";

// Function to retrieve a Spotify token using Client Credentials flow
export const getSpotifyToken = async () => {
  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  const authUrl = "https://accounts.spotify.com/api/token";

  try {
    const response = await Axios.post(authUrl, null, {
      params: {
        grant_type: "client_credentials",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(clientId + ":" + clientSecret)}`,
      },
    });

    // Return the access token
    return response.data.access_token;
  } catch (error) {
    console.error("Error retrieving Spotify token:", error);
    return null;
  }
};

// Function to search for a track in Spotify
export const searchSpotifyTrack = async (token, artist, song) => {
  const searchUrl = `https://api.spotify.com/v1/search?q=track:${song}%20artist:${artist}&type=track&limit=1`;

  try {
    const response = await Axios.get(searchUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.tracks.items.length > 0) {
      return response.data.tracks.items[0]; // Return the first matching track
    } else {
      return null; // No tracks found
    }
  } catch (error) {
    console.error("Error fetching Spotify track preview:", error);
    return null;
  }
};
