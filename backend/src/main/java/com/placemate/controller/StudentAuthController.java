package com.placemate.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.placemate.dto.EmailDTOs.EmailOTPValidationRequestDTO;
import com.placemate.dto.EmailDTOs.EmailRequestDTO;
import com.placemate.dto.LoginDTOs.SetPasswordDTO;
import com.placemate.dto.LoginDTOs.StudentLoginDTO;
import com.placemate.service.AuthService;
import com.placemate.service.StudentAuthService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class StudentAuthController {

	private AuthService authService;
	private StudentAuthService studentAuthService;
	
	@PostMapping(value = "/auth/student/login")
	public ResponseEntity<?> studentLogin(@RequestBody StudentLoginDTO studentLogin, HttpServletResponse resp){
		return ResponseEntity.ok(authService.login(studentLogin, resp));
	}
	
	
	@PostMapping("/auth/student/sendotp")
	public ResponseEntity<?> studentLoginFirstTime(@RequestBody EmailRequestDTO emailRequest){
		studentAuthService.checkUserAndGenerateOTP(emailRequest);
		return ResponseEntity.ok().build();
	}
	
	
	@PostMapping("/auth/student/validateotp")
	public ResponseEntity<?> validateStudentOTP(@RequestBody EmailOTPValidationRequestDTO emailRequest){
		return ResponseEntity.ok(studentAuthService.checkOtp(emailRequest));
	}
	
	// This sets the password for the very first time
	@PostMapping("/auth/student/setpassword")
	public ResponseEntity<?> setUserPassword(@RequestBody SetPasswordDTO passwordDTO){
		studentAuthService.handleFirstTimePassword(passwordDTO);
		return ResponseEntity.ok().build();
	}
}




