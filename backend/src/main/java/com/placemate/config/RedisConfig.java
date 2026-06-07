package com.placemate.config;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;

@Configuration
public class RedisConfig {
	
	@Bean
	public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
		RedisCacheConfiguration configuration = RedisCacheConfiguration.defaultCacheConfig()
	            .entryTtl(Duration.ofMinutes(10))
	            .serializeValuesWith(
	                    RedisSerializationContext.SerializationPair.fromSerializer(RedisSerializer.json())
	            );
		
		Map<String, RedisCacheConfiguration> specificCacheConfigs = new HashMap<>();
		specificCacheConfigs.put("collegeInterviewSchedule", configuration.entryTtl(Duration.ofMinutes(5)));
		
		return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(configuration)
                .withInitialCacheConfigurations(specificCacheConfigs)
                .build();
	}
}
