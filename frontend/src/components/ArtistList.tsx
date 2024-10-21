import React from "react";
import { Artist } from "../interfaces/UserTopItems";

interface ArtistListProps {
  artists: Array<Artist>;
}

const ArtistList: React.FC<ArtistListProps> = ({ artists }) => {
  return (
    <div className="artist-list">
      {artists.map((artist) => (
        <div key={artist.id} className="artist-card">
          <img
            src={artist.images[0]?.url || "default-image-url.jpg"}
            alt={artist.name}
            className="artist-image"
            width={artist.images[0]?.width || 150}
            height={artist.images[0]?.height || 150}
          />
          <h2>{artist.name}</h2>
          <p>
            <strong>Genres:</strong>{" "}
            {artist.genres.length > 0 ? artist.genres.join(", ") : "N/A"}
          </p>
          <p>
            <strong>Followers:</strong>{" "}
            {artist.followers?.total.toLocaleString() || "N/A"}
          </p>
          <p>
            <strong>Popularity:</strong> {artist.popularity || "N/A"}
          </p>
          <a
            href={artist.external_urls?.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            Listen on Spotify
          </a>
        </div>
      ))}
    </div>
  );
};

export default ArtistList;
