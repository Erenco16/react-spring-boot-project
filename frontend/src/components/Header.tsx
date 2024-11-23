import {UserData} from "../interfaces/UserData";

interface HeaderProps{
    userData: UserData;
}

const Header = ({ userData }: HeaderProps) => {
    const handleLogOut = () => {
        window.localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div className="header">
            <div className="user-information">
                <h1>Welcome, {userData.display_name}!</h1>
                <p>Spotify Profile:
                    <a href={userData.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                        Visit Profile
                    </a>
                </p>
                <p>Followers: {userData.followers.total}</p>
            </div>
            <button className="spotify-btn" onClick={handleLogOut}>
                Log out from Spotify
            </button>
        </div>
    );
}

export default Header;