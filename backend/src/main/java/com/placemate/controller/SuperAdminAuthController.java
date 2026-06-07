package com.placemate.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.placemate.dto.EmailDTOs.EmailRequestDTO;
import com.placemate.dto.LoginDTOs.SuperAdminLoginDTO;
import com.placemate.dto.SuperAdminDTOs.SuperAdminRegisterRequestDTO;
import com.placemate.service.AuthService;
import com.placemate.service.SuperAdminService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class SuperAdminAuthController {
	
	private SuperAdminService superAdminService;
	private AuthService authService;
	

	@PostMapping("/auth/superadmin/sendotp")
	public ResponseEntity<?> registerSuperAdmin(@RequestBody EmailRequestDTO emailDTO){
		superAdminService.sendOTP(emailDTO.email());
		return ResponseEntity.ok(null);
	}
	
	
	
	@PostMapping("/auth/superadmin/validateotp")
	public ResponseEntity<?> addStudentsList(@Valid @RequestBody SuperAdminRegisterRequestDTO superAdminDTO){
		superAdminService.checkOTP(superAdminDTO);
		return ResponseEntity.ok(superAdminService.saveSuperAdmin(superAdminDTO));
	}
	
	
	
	@PostMapping("/auth/superadmin/login")
	public ResponseEntity<?> adminLogin(@RequestBody SuperAdminLoginDTO loginRequest, HttpServletResponse servletResponse){
		return ResponseEntity.ok(authService.login(loginRequest, servletResponse));
	}
	
	
	@PostMapping("/auth/superadmin/refresh-token")
	public ResponseEntity<?> refreshTokens(@CookieValue(required = true) String refreshToken){
		return ResponseEntity.ok(authService.refreshToken(refreshToken));
	}
	
}
