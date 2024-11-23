import { useEffect, useState } from "react";
import axios from "axios";
import { UserData } from "../interfaces/UserData";
import { ArtistResponse } from "../interfaces/Artist";
import LoadingPage from "./LoadingPage";
import Header from '../components/Header'
import Error from "../components/Error";

// make sure the access token is not visible in the url
const cleanUrl = () => {
    const currentUrl = window.location.href;
    if (currentUrl.includes('#')) {
        // Remove everything after the '#' symbol
        window.history.replaceState(
            null,
            document.title,
            currentUrl.split('#')[0] // Keep only the base URL
        );
    }
};



// get artist details from spotify api
const getArtistInfo = async (artistName: string): Promise<[string, string]> => {
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&market=US`;

    try {
        const res = await axios.get(
            searchUrl,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        );

        const artist = res.data.artists.items[0];

        if (artist) {
            return [artist.id, artist.name];
        } else {
            // @ts-ignore
            throw new Error(`Artist with name "${artistName}" not found`);
        }
    } catch (error) {
        // @ts-ignore
        throw new Error(`Error fetching artist info: ${error}`);
    }
};


const Callback = () => {
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [artists, setArtists] = useState<ArtistResponse | null>(null);
  const [artistName, setArtistName] = useState("");
  const [artistID, setArtistID] = useState("");
  const [errorClass, setErrorClass] = useState("hidden"); // by default set the error box to hidden
  const [errorMsg, setErrorMsg] = useState("");

    const refreshTable = async() => {
        const requestUrl = "http://localhost:8080/api/artists/"
        try{
            await axios.get(requestUrl)
                .then((res) => {
                    setArtists({items: res.data});
                })
        }
        catch (error){
            console.error("Error while getting the artists from the database: ", error)
        }
    }

    // add artist to the backend
    const handleAddArtist = async (artistName: string) => {
        try {
            // Get artist details
            const [artistId, artistNameFromSpotify] = await getArtistInfo(artistName);

            const artistPayload = [{
                id: artistId,
                name: artistNameFromSpotify,
            }];
            console.log(`Body request: ${artistPayload}`);

            const res = await axios.post(
                "http://localhost:8080/api/artists/",
                artistPayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Artist added successfully:", res.data);
            await refreshTable();

            setErrorClass("success");
            setErrorMsg("Artist added successfully");
        } catch (error) {
            // @ts-ignore
            console.error("Error adding artist:", (error as Error).message);
            setErrorClass("error");
            // @ts-ignore
            setErrorMsg(`Error adding artist: ${(error as Error).message}`);
        }
    };


// updating artist
    const handleUpdateArtist = async(artistID: String, artistName: String) => {
        try {
            const res = await axios.put(
                `http://localhost:8080/api/artists/${artistID}`,
                {"id": artistID, "name": artistName},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Artist updated successfully:", res.data);
            await refreshTable();
            setErrorClass("success");
            setErrorMsg("Artist updated successfully");
        } catch (error) {
            console.error("Error updating artist:", (error as Error).message);
            setErrorClass("error");
            setErrorMsg(`Error updating artist: ${(error as Error).message}`);
        }
    }

// delete artist
    const handleDeleteArtist = async(artistId: String) => {
        if (artistId.length === 0){
            console.error("No artists selected!");
        }
        else{
            try {
                const res = await axios.delete(
                    `http://localhost:8080/api/artists/${artistId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log("Artist deleted successfully:", res.data);
                await refreshTable();
                setErrorClass("success");
                setErrorMsg("Artist deleted successfully");
            } catch (error) {
                console.error("Error deleting the artist:", (error as Error).message);
                setErrorClass("error");
                setErrorMsg(`Error deleting artist: ${(error as Error).message}`);
            }
        }
    }

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
    cleanUrl()
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
                    // add the inital artists to the db
                    res.data.userTopItemsData.items.forEach((artist: { name: string }) => {
                        handleAddArtist(artist.name);
                    });
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
              <Error errorClass={errorClass} errorMsg={errorMsg}/>
              <div className="artist-actions">
                  <input
                      type="text"
                      placeholder="Enter Artist ID"
                      value={artistID}
                      onChange={(e) => setArtistID(e.target.value)}
                  />
                  <input
                      type="text"
                      placeholder="Enter Artist Name"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                  />
                  <button className="action-btn" onClick={() => handleAddArtist(artistName)}>Add</button>
                  <button className="action-btn" onClick={() => handleUpdateArtist(artistID, artistName)}>Update</button>
                  <button className="action-btn delete-btn" onClick={() => handleDeleteArtist(artistID)}>Delete
                  </button>
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
