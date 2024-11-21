import { useEffect, useState } from "react";
import axios from "axios";
import { UserData } from "../interfaces/UserData";
import { ArtistResponse } from "../interfaces/Artist";
import LoadingPage from "./LoadingPage";
import Header from '../components/Header'


// adding artist
const handleAddArtist = () => {
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

// updating artist
const handleUpdateArtist = () => {
    axios
        .put("http://localhost:8080/api/artists/"
        )
        .then((res) => {
            console.log(res.data);
        })
        .catch((error) => {
            console.error("Error fetching data from the backend: ", error);
        });
}

// delete artist
const handleDeleteArtist = () => {
    axios
        .delete("http://localhost:8080/api/artists/"
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
  const [artistName, setArtistName] = useState("");



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
            axios
                .post("http://localhost:8080/api/spotify/data/",{ token: tokenFromLocalStorage }
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


  if (!userData || !artists) {
    return <LoadingPage/>;
  }
    return (
      <div className="App">
        <Header userData={userData}/>
          <div className="user-details">
              <div className="artist-actions">
                  <input
                      type="text"
                      placeholder="Enter Artist Name"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                  />
                  <button className="action-btn" onClick={handleAddArtist}>Add</button>
                  <button className="action-btn" onClick={handleUpdateArtist}>Update</button>
                  <button className="action-btn delete-btn" onClick={handleDeleteArtist}>Delete</button>
              </div>
              <table>
                  <thead>
                  <tr>
                      <th>Artist ID</th>
                      <th>Artist Name</th>
                  </tr>
                  </thead>
                  <tbody>
                  {artists.items.map((artist, index) => (
                      <tr>
                          <td>{artist.id}</td>
                          <td>{artist.name}</td>
                      </tr>
                  ))}

                  </tbody>
              </table>
          </div>
      </div>
    );
};

export default Callback;
