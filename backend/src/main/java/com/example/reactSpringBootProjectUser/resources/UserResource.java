package com.example.reactSpringBootProjectUser.resources;

import com.example.jdbc.UserArtistJDBCRepository;
import com.example.reactSpringBootProjectUser.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserResource {

    private final UserArtistJDBCRepository repo;

    @Autowired
    public UserResource(UserArtistJDBCRepository repo) {
        this.repo = repo;
    }

    // Endpoint to get all users
    @GetMapping("/")
    public List<User> getAllUsers() {
        return repo.selectAllUsers();
    }

    // Endpoint to get a user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = Optional.ofNullable(repo.getUserById(id));
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user.get());
    }


    // Endpoint to add a new user
    @PostMapping("/")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        repo.insertUser(user);

        // Construct the URI for the newly created resource
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(user.getId()) // Assuming `getId()` exists in User class
                .toUri();

        return ResponseEntity.created(location).build();
    }

    // Endpoint to delete all the users
    @DeleteMapping("")
    public ResponseEntity<Boolean> deleteAllUsers() {
        boolean isDeleted = repo.deleteAllUsers();
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }


    // Endpoint to delete a user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteUserById(@PathVariable String id) {
        boolean isDeleted = repo.deleteUserById(id);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // Endpoint to update a user by ID
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        Optional<User> existingUser = Optional.ofNullable(repo.getUserById(id));
        if (existingUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = existingUser.get();
        user.setDisplayName(updatedUser.getDisplayName());

        repo.updateUser(user);

        return ResponseEntity.ok(user);
    }
}
