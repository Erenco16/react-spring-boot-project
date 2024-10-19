package com.spotifyapi.demo.config;

import com.spotifyapi.demo.service.SpotifyAuthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final SpotifyAuthService spotifyAuthService;

    public AuthController(SpotifyAuthService spotifyAuthService) {
        this.spotifyAuthService = spotifyAuthService;
    }

    @GetMapping("/callback")
    public String handleSpotifyCallback(String code) {
        return spotifyAuthService.exchangeCodeForAccessToken(code);
    }
}
