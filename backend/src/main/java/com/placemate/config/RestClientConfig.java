package com.placemate.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

	@Value("${spring.brevo.api.key}")
	public String brevoAPIKey;
	@Value("${brevo.base.uri}")
	public String brevoUri;
	
	@Bean
	public RestClient brevoRestClient() {
		return RestClient.builder()
						.baseUrl(brevoUri)
						.defaultHeader("api-key", brevoAPIKey)
						.defaultHeader("content-type", "application/json")
						.defaultHeader("accept", "application/json")
						.build();
	}
}
