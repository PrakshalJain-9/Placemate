package com.placemate.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.placemate.dto.EmailDTOs.EmailOTPValidationRequestDTO;
import com.placemate.dto.EmailDTOs.EmailRequestDTO;
import com.placemate.dto.EmailDTOs.MailSendDTO;
import com.placemate.dto.LoginDTOs.SetPasswordDTO;
import com.placemate.entity.Student;
import com.placemate.entity.enums.MailType;
import com.placemate.entity.enums.StudentStatus;
import com.placemate.exceptions.BadTokenException;
import com.placemate.exceptions.OTPValidationException;
import com.placemate.exceptions.StudentNotFoundException;
import com.placemate.exceptions.UserNotAllowedException;
import com.placemate.repository.jpa.StudentRepository;
import com.placemate.security.service.JWTService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class StudentAuthService {
	
	private final StudentRepository studentRepository;
	private final PasswordEncoder passwordEncoder;
	private final OTPService otpService;
	private final JWTService jwtService;
	private final EmailService emailService;
	
	public void checkUserAndGenerateOTP(EmailRequestDTO emailRequest) 	{
		String email = emailRequest.email();
		String otp = null;	
		
		Student student = studentRepository.findStudentByEmailId(email).orElse(null);
		if(student == null || student.getPassword() != null) {
			throw new UserNotAllowedException("User with the id is not allowed");
		}else	
			otp = otpService.generateOTP(email);
		
		Map<String, Object> extraParams = new HashMap<>();
		extraParams.put("otp", otp);
		
		MailSendDTO mailSendDTO = MailSendDTO.builder()
											.collegeName(student.getCollege().getCollegeName())
											.name(student.getName())
											.to(email)
											.extraParams(extraParams)
											.mailType(MailType.OtpVerification)
											.build();
		emailService.sendMail(mailSendDTO);
	}	
	
	public String checkOtp(EmailOTPValidationRequestDTO emailRequest) {
		if(!otpService.checkOTP(emailRequest.email(), emailRequest.otp())) throw new OTPValidationException("Wrong OTP");
		Map<String, Object> claims = new HashMap<>();
		claims.put("scope", "SET_PASSWORD");
		String jwtToken = jwtService.generateGenericToken(emailRequest.email(), claims);
		return jwtToken;
	}
	
	
	public void handleFirstTimePassword(SetPasswordDTO passwordDTO) {
		String token = passwordDTO.token();
		if(!jwtService.isValidToken(token)) throw new BadTokenException("Invalid Token");
		
		Claims claims = jwtService.extractAllClaims(token);
		String email = claims.getSubject();
		updatePassword(email, passwordDTO.password());
		
	}
	
	public void updatePassword(String email, String password) {
		Student student = studentRepository.findStudentByEmailId(email).orElseThrow(() -> new StudentNotFoundException("Student with emailId not found"));
		student.setStatus(StudentStatus.JOINED);
		student.setPassword(passwordEncoder.encode(password));
		studentRepository.save(student);
	}
}
