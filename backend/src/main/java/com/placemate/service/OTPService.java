package com.placemate.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OTPService {
	
	private final RedisService redisService;
	@Value("${otp.ttl}")
	private Long otpTTL;

	public String generateOTP(String email) {
		Random random = new Random();
		int number = 100000 + random.nextInt(900000);
		String otp = String.valueOf(number);
		redisService.set(email + "::otp", otp, otpTTL);
		return otp;
	}
	
	
	public boolean checkOTP(String email, String otpReceived) {
		String otpSent = redisService.get(email + "::otp", String.class);
		if(!otpSent.equals(otpReceived)) return false;
		return true;
	}
}
