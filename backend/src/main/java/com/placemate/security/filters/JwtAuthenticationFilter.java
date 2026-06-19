package com.placemate.security.filters;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import com.placemate.security.core.CustomPrincipal;
import com.placemate.security.service.CookieService;
import com.placemate.security.service.JWTService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

	private JWTService jwtService;
	private CookieService cookieService;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		Cookie cookie = WebUtils.getCookie(request, "accessToken");
		if(cookie == null) {
			filterChain.doFilter(request, response);
			return;
		}
		
		String jwtToken = getJwtToken(request);
		if(!jwtService.isValidToken(jwtToken) || !jwtService.isAccessToken(jwtToken)) {
			cookieService.deleteAuthCookies();
			filterChain.doFilter(request, response);
			return;
		}
		
		
		Claims claims = jwtService.extractAllClaims(jwtToken);
		String role = (String) claims.get("role");
		String email = (String) claims.getSubject();
		int collegeId = (int) claims.get("collegeId");
		String fullName = (String) claims.get("fullName");
		int userId = (int) claims.get("userId");
		
		if(email == null || SecurityContextHolder.getContext().getAuthentication() != null) {
			filterChain.doFilter(request, response);
			return;
		}
		
		CustomPrincipal customPrincipal = CustomPrincipal.builder()
						   .collegeId(collegeId)
						   .email(email)
						   .fullName(fullName)
						   .userId(userId)
						   .role(role.toUpperCase())
						   .build();
			

		role = role.toUpperCase();
		if(jwtService.validateTokenForUser(jwtToken, email)) {
			UsernamePasswordAuthenticationToken authToken = new 
					UsernamePasswordAuthenticationToken(customPrincipal, 
														null,
														List.of(new SimpleGrantedAuthority(role)));
			authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
			SecurityContextHolder.getContext().setAuthentication(authToken);
			
		}
		
		filterChain.doFilter(request, response);
	}

	
	private String getJwtToken(HttpServletRequest req) {
		String value =  WebUtils.getCookie(req, "accessToken").getValue();
		return value;
	}


	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		return "OPTIONS".equalsIgnoreCase(request.getMethod());
	}
	
	
	
}
