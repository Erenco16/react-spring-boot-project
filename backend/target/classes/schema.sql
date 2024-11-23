drop table if exists course;

CREATE TABLE users (
                       user_id INT AUTO_INCREMENT PRIMARY KEY,
                       user_name VARCHAR(255) NOT NULL,
                       spotify_account_uri VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE artists (
                         artist_id INT AUTO_INCREMENT PRIMARY KEY,
                         artist_name VARCHAR(255) NOT NULL UNIQUE
);
CREATE TABLE user_artists (
                              user_id INT NOT NULL,
                              artist_id INT NOT NULL,
                              rank INT NOT NULL,
                              PRIMARY KEY (user_id, rank),
                              FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                              FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE,
                              UNIQUE (user_id, artist_id)
);
