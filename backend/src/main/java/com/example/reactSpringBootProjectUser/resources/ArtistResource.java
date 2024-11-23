package com.example.reactSpringBootProjectUser.resources;

import com.example.jdbc.UserArtistJDBCRepository;
import com.example.reactSpringBootProjectUser.Artist;
import com.example.reactSpringBootProjectUser.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/artists")
public class ArtistResource {

    private final UserArtistJDBCRepository repo;

    @Autowired
    public ArtistResource(UserArtistJDBCRepository repo) {
        this.repo = repo;
    }

    // Endpoint to get all artists
    @GetMapping("/")
    public List<Artist> getAllArtists() {
        return repo.getAllArtists();
    }

    // Endpoint to get an artist by ID
    @GetMapping("/{id}")
    public ResponseEntity<Artist> getArtist(@PathVariable String id) {
        Optional<Artist> artist = Optional.ofNullable(repo.getArtistByID(id));
        if (artist.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(artist.get());
    }

    // Endpoint to add a new artist
    @PostMapping("/")
    public ResponseEntity<String> addArtist(@RequestBody Artist artist) {
        try {
            repo.insertArtist(artist);
            URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(artist.getId())
                    .toUri();
            return ResponseEntity.created(location).body("Artist added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add artist: " + e.getMessage());
        }
    }

    // Endpoint to delete an artist by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteArtistById(@PathVariable String id) {
        boolean isDeleted = repo.deleteArtistById(id);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // Endpoint to delete all artists
    @DeleteMapping("/")
    public ResponseEntity<Boolean> deleteAllArtists() {
        boolean isDeleted = repo.deleteAllArtists();
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // Endpoint to update an artist by ID
    @PutMapping("/{id}")
    public ResponseEntity<Artist> updateArtist(@PathVariable String id, @RequestBody Artist updatedArtist) {
        Optional<Artist> existingArtist = Optional.ofNullable(repo.getArtistByID(id));
        if (existingArtist.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Artist artist = existingArtist.get();
        artist.setName(updatedArtist.getName());

        repo.updateArtist(artist);

        return ResponseEntity.ok(artist);
    }
}
