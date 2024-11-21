package com.example.jdbc;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;


@RestController
@CrossOrigin("http://localhost:3000") // allow requests from this url
@RequestMapping("/api/spotify")
public class SpotifyRepository {

    private static final String SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

    @PostMapping("/data/")
    public ResponseEntity<Map<String, Object>> getSpotifyData(@RequestBody Map<String, String> request) {
        String token = request.get("token");

        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Access token is missing"));
        }

        // Create headers with the access token
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // calling spotify api
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> responseMap = new HashMap<>();

        try {
            // Fetch user data
            ResponseEntity<Map> userDataResponse = restTemplate.exchange(
                    SPOTIFY_API_BASE_URL + "/me",
                    HttpMethod.GET,
                    entity,
                    Map.class
            );
            responseMap.put("userData", userDataResponse.getBody());

            // Fetch top artists data
            ResponseEntity<Map> topArtistsResponse = restTemplate.exchange(
                    SPOTIFY_API_BASE_URL + "/me/top/artists?time_range=medium_term&limit=5",
                    HttpMethod.GET,
                    entity,
                    Map.class
            );
            responseMap.put("userTopItemsData", topArtistsResponse.getBody());

            return ResponseEntity.ok(responseMap);

        } catch (Exception e) {
            // Log more details for debugging
            System.err.println("Error while calling Spotify API: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "An error occurred while fetching Spotify data",
                            "details", e.getMessage()
                    ));
        }

    }
}




