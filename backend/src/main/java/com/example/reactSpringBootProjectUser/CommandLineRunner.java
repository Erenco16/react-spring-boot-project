package com.example.reactSpringBootProjectUser;

import com.example.jdbc.UserArtistJDBCRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CommandLineRunner {

    @Autowired
    private UserArtistJDBCRepository userArtistJDBCRepository;
}
