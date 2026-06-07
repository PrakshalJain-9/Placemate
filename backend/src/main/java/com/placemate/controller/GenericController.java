package com.placemate.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.placemate.security.utils.SecurityUtils;
import com.placemate.service.AuthService;

import lombok.AllArgsConstructor;

@RestController
@PreAuthorize("hasAnyAuthority('STUDENT', 'ADMIN', 'SUPERADMIN')")
@AllArgsConstructor
public class GenericController {

	public AuthService authService;
	
	@GetMapping("api/user/me")
	public ResponseEntity<?> getUserDetails() {
		return ResponseEntity.ok(SecurityUtils.getPrincipal());
	}
	
	@PostMapping("/api/auth/logout")
	public ResponseEntity<?> logoutUser(){
		authService.logout();
		return ResponseEntity.ok().build();
	}
}
