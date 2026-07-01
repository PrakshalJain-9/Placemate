package com.placemate.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.placemate.dto.LoginDTOs.LoginRequestDTO;
import com.placemate.entity.RefreshToken;
import com.placemate.entity.Student;
import com.placemate.entity.SuperAdmin;
import com.placemate.helpers.TokenPair;
import com.placemate.security.core.CustomPrincipal;
import com.placemate.security.core.SecuritySuperAdmin;
import com.placemate.security.core.SecurityUser;
import com.placemate.security.service.CookieService;
import com.placemate.security.service.JWTService;
import com.placemate.security.service.RefreshTokenService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class AuthService {

    private RefreshTokenService refreshTokenService;

	private JWTService jwtService;
	private AuthenticationManager authenticationManager;
	private SuperAdminService superAdminService;
	private StudentService studentService;
	private CookieService cookieService;
		
	
	public CustomPrincipal login(LoginRequestDTO loginRequest, HttpServletResponse resp) {
		System.out.println(loginRequest);
		Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.emailId(), loginRequest.password()));
		CustomPrincipal principal = generateCustomPrincipalFrom(authentication);
		Authentication newAuth = new UsernamePasswordAuthenticationToken(principal, null , authentication.getAuthorities());
		SecurityContextHolder.getContext().setAuthentication(newAuth);
		
		TokenPair tokens = jwtService.generateTokenPair(newAuth);
		cookieService.addTokenToCookie(tokens);
		
		return principal;
	}
	
	
	private CustomPrincipal generateCustomPrincipalFrom(Authentication authentication) {
		
		UserDetails userDetails = (UserDetails) authentication.getPrincipal();
		if(userDetails instanceof SecuritySuperAdmin) {
			SuperAdmin superAdmin = ((SecuritySuperAdmin) userDetails).getSuperAdmin();
			return CustomPrincipal.builder()
														.collegeId(superAdmin.getCollege().getId())
														.userId(superAdmin.getId())
														.email(superAdmin.getEmailId())
														.fullName("admin")
														.role(superAdmin.getRole())
														.build();
												
		}else {
			Student student = ((SecurityUser) userDetails).getStudent();
			return CustomPrincipal.builder()
								  .collegeId(student.getCollege().getId())
								  .email(student.getEmailId())
								  .fullName(student.getName())
								  .userId(student.getId())
								  .role(student.getRole())
								  .build();
		}
	}
	

	private CustomPrincipal generateCustomPrincipalFrom(Object principal, Class<?> objClass) {
		if(objClass.equals(Student.class)) {
			Student student = (Student) principal;
			return CustomPrincipal.builder()
								  .collegeId(student.getCollege().getId())
								  .email(student.getEmailId())
								  .fullName(student.getName())
								  .role(student.getRole())
								  .userId(student.getId())
								  .build();
		}else {
			SuperAdmin superAdmin = (SuperAdmin) principal;
			return CustomPrincipal.builder()
								  .collegeId(superAdmin.getCollege().getId())
								  .email(superAdmin.getEmailId())
								  .fullName(superAdmin.getEmailId())
								  .role(superAdmin.getRole())
								  .userId(superAdmin.getId())
								  .build();
		}
	}
	
	public TokenPair refreshToken(String refreshToken) {
		RefreshToken token = refreshTokenService.findRefreshToken(refreshToken);
		System.out.println(token);
		CustomPrincipal principal = null;
		if(token.getSuperAdminId() == null) {
			Student student = studentService.findStudentById(token.getStudentId());
			principal = generateCustomPrincipalFrom(student, Student.class);
		}else {
			SuperAdmin superAdmin = superAdminService.findById(token.getSuperAdminId());
			principal = generateCustomPrincipalFrom(superAdmin, SuperAdmin.class);
		}
		
		System.out.println(principal);
		
		Authentication authentication = new UsernamePasswordAuthenticationToken(
										principal, null,
										List.of(new SimpleGrantedAuthority(principal.getRole())));
		
		TokenPair pair = jwtService.generateTokenPair(authentication);
		cookieService.addTokenToCookie(pair);
		return pair;
	}
	
	
}




