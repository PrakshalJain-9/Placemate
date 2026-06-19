package com.placemate.security.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import com.placemate.helpers.TokenPair;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Component
@Data
@RequiredArgsConstructor
public class CookieService {

	@Value("${jwt.refreshExpirationTime}")
	private long refreshTokenExpireTime;
	@Value("${jwt.accessExpirationTime}")
	private long accessTokenExpireTime;

	@Value("${cookie.secure}")
	private boolean isCookieSecure;

	private final HttpServletResponse resp;
	private final HttpServletRequest request;
	private final RefreshTokenService refreshTokenService;

	public void addTokenToCookie(TokenPair pair) {
		String sameSitePolicy = isCookieSecure ? "None" : "Lax";
		ResponseCookie accessCookie = ResponseCookie.from("accessToken", pair.getAccessToken()).httpOnly(true)
				.secure(isCookieSecure).path("/").maxAge(accessTokenExpireTime / 1000).sameSite(sameSitePolicy).build();

		ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", pair.getRefreshToken()).httpOnly(true)
				.secure(isCookieSecure).path("/").maxAge(refreshTokenExpireTime / 1000).sameSite(sameSitePolicy)
				.build();

		resp.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
		resp.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
	}

	public void deleteAuthCookies() {

		String refreshToken = null;
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equalsIgnoreCase("refreshToken")) {
					refreshToken = cookie.getValue();
				}
			}
		}

		String sameSitePolicy = isCookieSecure ? "None" : "Lax";
		ResponseCookie accessCookie = ResponseCookie.from("accessToken", "").httpOnly(true).secure(isCookieSecure)
				.path("/").maxAge(0).sameSite(sameSitePolicy).build();

		ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "").httpOnly(true).secure(isCookieSecure)
				.path("/").maxAge(0).sameSite(sameSitePolicy).build();

		ResponseCookie sessionCookie = ResponseCookie.from("JSESSIONID", "").httpOnly(true).secure(isCookieSecure)
				.path("/").maxAge(0).sameSite(sameSitePolicy).build();

		resp.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
		resp.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
		resp.addHeader(HttpHeaders.SET_COOKIE, sessionCookie.toString());

		if (refreshToken != null) {
			refreshTokenService.deleteToken(refreshToken);
		}
	}
}
