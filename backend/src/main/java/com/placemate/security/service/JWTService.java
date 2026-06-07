package com.placemate.security.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.placemate.helpers.TokenPair;
import com.placemate.security.core.CustomPrincipal;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JWTService {

	@Value("${jwt.refreshExpirationTime}")
	private long refreshTokenExpireTime;
	@Value("${jwt.accessExpirationTime}")
	private long accessTokenExpireTime;
	@Value("${jwt.secretKey}")
	private String secretKey;
	
	private final RefreshTokenService refreshTokenService;
	
	
	private String generateToken(Authentication authentication, long expirationTimeInMs, Map<String, Object> claims) {
		CustomPrincipal userDetails = (CustomPrincipal) authentication.getPrincipal();
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + expirationTimeInMs);
		
		return Jwts.builder()
				   .setHeaderParam("typ", "JWT")
				   .setSubject(userDetails.getEmail())
				   .addClaims(claims)
				   .claim("role", userDetails.	getRole())
				   .claim("fullName", userDetails.getFullName())
				   .claim("collegeId", userDetails.getCollegeId())
				   .claim("userId", userDetails.getUserId())
				   .setIssuedAt(now)
				   .setExpiration(expiryDate)
				   .signWith(getSecretKey())
				   .compact();
	}
	
	private String generateAccessToken(Authentication authentication) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("tokenType", "access_token");
		return generateToken(authentication, accessTokenExpireTime, claims);
	}
	
	
	private String generateRefreshToken(Authentication authentication) {
		CustomPrincipal principal = (CustomPrincipal) authentication.getPrincipal();
		String token = refreshTokenService.generateRefreshToken(principal);
		return token;
	}
	
	
	public TokenPair generateTokenPair(Authentication authentication) {
		return new TokenPair(generateAccessToken(authentication), generateRefreshToken(authentication));
	}
	
	
	public boolean validateTokenForUser(String token, String currUsername) {
		String username = extractUsername(token);
		return username != null && username.equals(currUsername);
	}
	
	public boolean isValidToken(String token) {
		return extractAllClaims(token) != null;
	}
	
	
	public boolean isAccessToken(String token) {
		return extractAllClaims(token).get("tokenType", String.class).equals("access_token");
	}
	
	
	public boolean isRefreshToken(String token) {
		return !extractAllClaims(token).get("tokenType", String.class).equals("access_token");
	}
	
	
	public String extractRole(String token) {
		return (String) extractAllClaims(token).get("role");
	}
	
	public String extractUsername(String token) {
		Claims claims = extractAllClaims(token);
		if(claims != null) return claims.getSubject();
		
		return null;
	}
	
	public Claims extractAllClaims(String token) {
		Claims claims = null;
		
		try {
			claims = (Claims) Jwts.parserBuilder()
					.setSigningKey(getSecretKey())
					.build()
					.parse(token)
					.getBody();
		}catch(JwtException | IllegalArgumentException e) {
			throw new RuntimeException(e);
		}
		
		return claims;
	}
	
	private SecretKey getSecretKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
		return Keys.hmacShaKeyFor(keyBytes);
	}
	
	public String generateGenericToken(String subject, Map<String, Object> claims) {
		String token = Jwts.builder()
							.addClaims(claims)
							.setSubject(subject)
							.signWith(getSecretKey())
							.setExpiration(new Date(System.currentTimeMillis() + 5*60*1000))
							.compact();
		return token;
	}
	
}







