package com.placemate.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@RedisHash("RefreshToken")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RefreshToken {

	@Id
	private String token;
	
	@Indexed
	private Integer studentId;
	@Indexed
	private Integer superAdminId;
	
	@TimeToLive
	private Long expirationInSeconds;
	
}
