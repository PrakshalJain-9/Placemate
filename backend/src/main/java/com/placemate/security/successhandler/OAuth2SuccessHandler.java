package com.placemate.security.successhandler;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.placemate.entity.Student;
import com.placemate.entity.enums.StudentStatus;
import com.placemate.helpers.TokenPair;
import com.placemate.security.core.CustomPrincipal;
import com.placemate.security.service.CookieService;
import com.placemate.security.service.JWTService;
import com.placemate.service.StudentService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler{
	
	private final StudentService studentService;
	private final JWTService jwtService;	
	private final CookieService cookieService;
	
	@Value("${frontend.url}")
	private String frontendUrl;
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		
		OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
		String email = oauth2User.getAttribute("email");
		
		Student student = studentService.findStudentByEmailId(email);
		if(student.getStatus() == StudentStatus.NOTJOINED) {			
			student.setStatus(StudentStatus.JOINED);
			studentService.saveStudent(student);
		}
		
		
		CustomPrincipal principal = CustomPrincipal.builder()
												   .email(email)
												   .collegeId(student.getCollege().getId())
												   .fullName(student.getName())
												   .role(student.getRole())
												   .userId(student.getId())
												   .build();
			
		UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal, null, List.of(new SimpleGrantedAuthority(student.getRole().toUpperCase())));
		TokenPair pair = jwtService.generateTokenPair(auth);
		auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		SecurityContextHolder.getContext().setAuthentication(auth);
		
		String redirectUri = UriComponentsBuilder.fromUriString(frontendUrl)
												.build().toString();
		
		cookieService.addTokenToCookie(pair);
		getRedirectStrategy().sendRedirect(request, response, redirectUri);
		
	}
	
	
}
