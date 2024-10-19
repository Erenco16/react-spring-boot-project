package com.spotifyapi.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);

		String url = "https://catfact.ninja/fact";

		WebClient.Builder builder = WebClient.builder();

		String catFact = builder.build()
				.get()
				.uri(url)
				.retrieve()
				.bodyToMono(String.class)
				.block();

		System.out.println("=======================");
		System.out.println(catFact);
		System.out.println("=======================");
	}

}
