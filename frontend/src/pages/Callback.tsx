import { useEffect, useState } from "react";
import axios from "axios";
import { UserData } from "../interfaces/UserData";
import { ArtistResponse } from "../interfaces/Artist";
import LoadingPage from "./LoadingPage";

const enterArtistsIntoDb = () => {
    axios
        .post("http://localhost:8080/api/artists/"
        )
        .then((res) => {
            console.log(res.data);
        })
        .catch((error) => {
            console.error("Error fetching data from the backend: ", error);
        });
}

const Callback = () => {
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [artists, setArtists] = useState<ArtistResponse | null>(null);

  // get the access token
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
    setToken(tokenFromLocalStorage);
    console.log(`Token: ${token}`);
  }, [token]);

  // send request to the spring boot endpoint
    useEffect(() => {
        const tokenFromLocalStorage = window.localStorage.getItem("token");

        if (tokenFromLocalStorage) {
            const headers = {'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'};
            axios
                .post("http://localhost:8080/api/spotify/data", { token: tokenFromLocalStorage }
                    )
                .then((res) => {
                    console.log(res.data.userTopItemsData.items);
                    setUserData(res.data.userData);
                    setArtists(res.data.userTopItemsData);
                })
                .catch((error) => {
                    console.error("Error fetching data from the backend: ", error);
                });
        }
    }, []);


    const handleLogOut = () => {
    window.localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!userData || !artists) {
    return <LoadingPage/>;
  }

    return (
      <div className="App">
        <h1>This is the callback page.</h1>
        <button className="spotify-btn" onClick={handleLogOut}>
          Log out from Spotify
        </button>

        <h1>Welcome, {userData.display_name}!</h1>
        <p>Spotify Profile:
          <a href={userData.external_urls.spotify} target="_blank" rel="noopener noreferrer">
            Visit Profile
          </a>
        </p>
        <p>Followers: {userData.followers.total}</p>

        <table>
          <thead>
          <tr>
            <th>Artist ID</th>
            <th>Artist Name</th>
          </tr>
          </thead>
          <tbody>
          {artists.items.map((artist, index) => (
              <tr key={artist.id || index}>
                  <td>{artist.id}</td>
                  <td>{artist.name}</td>
              </tr>
          ))}

          </tbody>
        </table>
      </div>
  );
};

export default Callback;
