package com.placemate.service;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import tools.jackson.databind.ObjectMapper;

@Component
@AllArgsConstructor
public class RedisService {

	private StringRedisTemplate redisTemplate;
	private ObjectMapper mapper;

	
	public <T> T get(String key, Class<T> entityClass) {
		Object o = redisTemplate.opsForValue().get(key);
		return mapper.readValue(o.toString(), entityClass);
	}
	
	public void set(String key, Object o, Long ttl) {
		String jsonValue = mapper.writeValueAsString(o);
		redisTemplate.opsForValue().set(key, jsonValue, ttl, TimeUnit.SECONDS);
	}
	
}
	

