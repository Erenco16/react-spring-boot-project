package com.example.jdbc;

import com.example.reactSpringBootProjectUser.Artist;
import com.example.reactSpringBootProjectUser.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserArtistJDBCRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private String userInsertQuery = "INSERT INTO USERS VALUES(?,?,?)";
    private String artistInsertQuery = "INSERT INTO ARTISTS VALUES(?,?)";
    private String userArtistInsertQuery = "INSERT INTO USER_ARTISTS VALUES(?,?,?)";

    public void insertUser(User user) {
        jdbcTemplate.update(userInsertQuery, user.getId(), user.getDisplayName(), user.getUri());
    }

    public void insertArtist(Artist artist) {
        jdbcTemplate.update(artistInsertQuery, artist.getId(), artist.getName());
    }

    public void insertUserArtist(User user, Artist artist, Integer rank) {
        jdbcTemplate.update(userArtistInsertQuery, user.getId(), artist.getId(), rank);
    }

    // Select Methods
    public List<User> selectAllUsers() {
        String query = "SELECT user_id, user_name, spotify_account_uri FROM USERS";
        return jdbcTemplate.query(query, (rs, rowNum) ->
                new User(rs.getString("user_id"), rs.getString("user_name"), rs.getString("uri"))
        );
    }

    public List<Artist> getAllArtists() {
        String query = "SELECT artist_id, artist_name FROM ARTISTS";
        return jdbcTemplate.query(query, (rs, rowNum) ->
                new Artist(rs.getString("artist_id"), rs.getString("artist_name"))
        );
    }

    public Artist getArtistByID(String id) {
        String query = "SELECT artist_id, artist_name FROM ARTISTS WHERE artist_id = ?";
        try {
            return jdbcTemplate.queryForObject(query, new Object[]{id}, (rs, rowNum) ->
                    new Artist(rs.getString("artist_id"), rs.getString("artist_name"))
            );
        } catch (EmptyResultDataAccessException e) {
            // Return null if no artist is found
            return null;
        }
    }


    public List<Artist> getUserArtists(String userId) {
        String query = "SELECT a.artist_id, a.artist_name FROM ARTISTS a " +
                "JOIN USER_ARTISTS ua ON a.artist_id = ua.artist_id " +
                "WHERE ua.user_id = ? ORDER BY ua.rank";
        return jdbcTemplate.query(query, new Object[]{userId}, (rs, rowNum) ->
                new Artist(rs.getString("artist_id"), rs.getString("artist_name"))
        );
    }

    public User getUserById(String userId) {
        String query = "SELECT user_id, user_name, spotify_account_uri FROM USERS WHERE user_id = ?;";
        return jdbcTemplate.queryForObject(query, new Object[]{userId}, (rs, rowNum) ->
                new User(rs.getString("user_id"), rs.getString("display_name"), rs.getString("uri"))
        );
    }

    // Delete Methods
    public boolean deleteUserById(String userId) {
        String query = "DELETE FROM USERS WHERE user_id = ?";
        jdbcTemplate.update(query, userId);
        return jdbcTemplate.update(query, userId) > 0;
    }

    public boolean deleteArtistById(String artistId) {
        String query = "DELETE FROM ARTISTS WHERE artist_id = ?";
        jdbcTemplate.update(query, artistId);
        return jdbcTemplate.update(query, artistId) > 0;
    }

    public boolean deleteUserArtists(String userId) {
        String query = "DELETE FROM USER_ARTISTS WHERE user_id = ?";
        jdbcTemplate.update(query, userId);
        return jdbcTemplate.update(query, userId) > 0;
    }

    // Update Methods
    public void updateUser(User user) {
        String query = "UPDATE USERS SET user_name = ?, spotify_account_uri = ? WHERE id = ?";
        jdbcTemplate.update(query, user.getDisplayName(), user.getUri(), user.getId());
    }

    public void updateArtist(Artist artist) {
        String query = "UPDATE ARTISTS SET artist_name = ? WHERE artist_id = ?";
        jdbcTemplate.update(query, artist.getName(), artist.getId());
    }

    public void updateUserArtistRank(String userId, String artistId, Integer newRank) {
        String query = "UPDATE USER_ARTISTS SET rank = ? WHERE user_id = ? AND artist_id = ?";
        jdbcTemplate.update(query, newRank, userId, artistId);
    }

}
