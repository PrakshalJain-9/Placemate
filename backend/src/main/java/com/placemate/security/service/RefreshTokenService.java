package com.placemate.security.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.placemate.entity.RefreshToken;
import com.placemate.exceptions.TokenNotFoundException;
import com.placemate.repository.redis.RefreshTokenRepository;
import com.placemate.security.core.CustomPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

	private final RefreshTokenRepository refreshTokenRepository;
	@Value("${jwt.refreshExpirationTime}")
	private long expirationTime;
	
	
	public String generateRefreshToken(CustomPrincipal principal) {
		
		
		String tok = UUID.randomUUID().toString();
		RefreshToken.RefreshTokenBuilder refresh = RefreshToken.builder()
																.token(tok)
																.expirationInSeconds(expirationTime);

		if (principal.getRole().equalsIgnoreCase("superadmin")) {
			refresh.superAdminId(principal.getUserId());
		} else {
			refresh.studentId(principal.getUserId());
		}

		refreshTokenRepository.save(refresh.build());
		return tok;
	}
	
	public boolean validateRefreshToken(String refreshToken) {
		refreshTokenRepository.findById(refreshToken).orElseThrow(() -> new TokenNotFoundException("Refresh token was not found"));
		return true;
	}
	
	
	public RefreshToken findRefreshToken(String token) {
		return refreshTokenRepository.findById(token).orElseThrow(() -> new TokenNotFoundException("The token with value " + token + " was not found"));
	}
	
	
	public void deleteToken(String refreshToken) {
		refreshTokenRepository.deleteByToken(refreshToken);
	}
	
	
	public void deleteAllToken() {
		refreshTokenRepository.deleteAll();
	}
}
