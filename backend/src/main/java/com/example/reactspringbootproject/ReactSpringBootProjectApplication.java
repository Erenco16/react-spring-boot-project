package com.example.reactspringbootproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"com.example.reactSpringBootProjectUser", "com.example.jdbc"})
public class ReactSpringBootProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReactSpringBootProjectApplication.class, args);
	}

}
