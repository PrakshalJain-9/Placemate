package com.placemate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.redis.core.RedisKeyValueAdapter.EnableKeyspaceEvents;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.placemate.repository.jpa")
@EnableRedisRepositories(basePackages = "com.placemate.repository.redis", enableKeyspaceEvents = EnableKeyspaceEvents.ON_STARTUP)
@PropertySource("classpath:messages.properties")
@EnableCaching
@EnableAsync
public class PlacemateApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlacemateApplication.class, args);
	}

}
