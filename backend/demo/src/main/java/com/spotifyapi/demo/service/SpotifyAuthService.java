package com.spotifyapi.demo.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.spotifyapi.demo.config.SpotifyProperties;

import java.util.Base64;
import java.util.Map;

@Service
public class SpotifyAuthService {

    private final SpotifyProperties spotifyProperties;

    public SpotifyAuthService(SpotifyProperties spotifyProperties) {
        this.spotifyProperties = spotifyProperties;
    }

    public String exchangeCodeForAccessToken(String code) {
        String tokenUrl = "https://accounts.spotify.com/api/token";
        RestTemplate restTemplate = new RestTemplate();

        // Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(getBase64ClientCredentials());

        // Prepare body with required parameters
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", spotifyProperties.getRedirectUri());

        // Combine headers and body
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                tokenUrl,
                HttpMethod.GET,
                requestEntity,
                Map.class);

        // Extract access token from the response
        if (response.getBody() != null && response.getBody().containsKey("access_token")) {
            return response.getBody().get("access_token").toString();
        } else {
            throw new RuntimeException("Error: Unable to retrieve access token from Spotify.");
        }
    }

    // Helper method to encode clientId and clientSecret in Base64
    private String getBase64ClientCredentials() {
        String clientId = spotifyProperties.getClientId();
        String clientSecret = spotifyProperties.getClientSecret();
        String credentials = clientId + ":" + clientSecret;
        return Base64.getEncoder().encodeToString(credentials.getBytes());
    }
}
