const Home = () => {
  const generateRandomString = (length: number): string => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  // delete the access token if exists
  window.localStorage.setItem("token", "");

  // logging the redirect uri into the console to make sure the url is correct
  // env variables for auth
  const client_id: string = process.env.REACT_APP_SPOTIFY_CLIENT_ID as string;
  const redirect_uri: string = process.env
    .REACT_APP_SPOTIFY_REDIRECT_URI as string;

  const auth_endpoint = "https://accounts.spotify.com/authorize";
  const state: string = generateRandomString(16);
  const scope: string = "user-read-private user-read-email user-top-read";
  const response_type = "token";
  const spotifyAuthUrl =
    `${auth_endpoint}?` +
    `&client_id=${client_id}` +
    `&redirect_uri=${redirect_uri}` +
    `&state=${state}` +
    `&response_type=${response_type}` +
    `&scope=${scope}`;
  console.log(`Redirect url ${redirect_uri}`);
  return (
    <div className="App">
      <div className="main-container">
        <h1>Display your artists!</h1>
        <h2>
          In order to see your artists, you need to click the button below.
        </h2>
        <a href={spotifyAuthUrl}>
          <button className="spotify-btn">Log into Spotify</button>
        </a>
      </div>
    </div>
  );
};

export default Home;
