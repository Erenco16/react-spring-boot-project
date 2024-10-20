import { useEffect, useState } from "react";
import { UserData } from "../interfaces/UserData";
import axios from "axios";

const Callback = () => {
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  useEffect(() => {
    const hash = window.location.hash;
    let tokenFromLocalStorage = window.localStorage.getItem("token") as string;

    if (!tokenFromLocalStorage && hash) {
      const tokenFromHash = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"));

      if (tokenFromHash) {
        tokenFromLocalStorage = tokenFromHash.split("=")[1];
        window.localStorage.setItem("token", tokenFromLocalStorage);
      }
    }
    window.location.pathname = "";
    setToken(tokenFromLocalStorage);
  }, [token]);

  // useEffect to display personal user information on the web page
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const base_url = "https://api.spotify.com/v1/me";
    const header_payload = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .get(`${base_url}`, { headers: header_payload })
      .then((res) => {
        setUserData(res.data);
      })
      .catch((error) => {
        console.log(`Error occured while fetching user info: ${error}`);
      });
  });

  const handleLogOut = () => {
    setToken("");
    window.localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!userData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="App">
      <h1>This is the callback page.</h1>
      <button className="spotify-btn" onClick={handleLogOut}>
        Log out from Spotify
      </button>
      <div>
        <h1>Welcome, {userData.display_name}!</h1>
        <p>
          Spotify Profile:{" "}
          <a
            href={userData.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Profile
          </a>
        </p>
        <p>Followers: {userData.followers.total}</p>
        <img
          src={userData.images[0].url}
          alt={userData.display_name}
          width={userData.images[0].width}
          height={userData.images[0].height}
        />
      </div>
    </div>
  );
};

export default Callback;
