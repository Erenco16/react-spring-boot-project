import React from "react";

const InitialPage: React.FC = () => {
  const handleSpotifyLogin = () => {
    // Environment variables for Spotify API credentials
    const client_id: string = process.env.REACT_APP_SPOTIFY_CLIENT_ID as string;
    const redirect_uri: string = process.env
      .REACT_APP_SPOTIFY_REDIRECT_URI as string;
    const stateKey: string = "spotify_auth_state";
    const state: string = generateRandomString(16);
    const scope: string = "user-read-private user-read-email";

    sessionStorage.setItem(stateKey, state);

    const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams(
      {
        response_type: "code",
        client_id,
        scope,
        redirect_uri,
        state,
      }
    ).toString()}`;

    window.location.href = authUrl; // Redirect to Spotify login
  };

  const generateRandomString = (length: number): string => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  return (
    <div className="main-container">
      <h1>Display your playlists!</h1>
      <h2>
        In order to see your playlists, you need to click the button below.
      </h2>
      <button className="spotify-btn" onClick={handleSpotifyLogin}>
        Log in with Spotify
      </button>
    </div>
  );
};

export default InitialPage;
