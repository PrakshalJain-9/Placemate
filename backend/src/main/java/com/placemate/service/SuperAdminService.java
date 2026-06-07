package com.placemate.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.placemate.dto.EmailDTOs.MailSendDTO;
import com.placemate.dto.SuperAdminDTOs.SuperAdminRegisterRequestDTO;
import com.placemate.entity.College;
import com.placemate.entity.SuperAdmin;
import com.placemate.entity.enums.MailType;
import com.placemate.exceptions.OTPValidationException;
import com.placemate.exceptions.SuperAdminNotFoundException;
import com.placemate.mapper.SuperAdminMapper;
import com.placemate.repository.jpa.SuperAdminRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SuperAdminService {
	
	private final SuperAdminRepository superAdminRepository;
	private final SuperAdminMapper superAdminMapper;
	private final CollegeService collegeService;
	private final PasswordEncoder passwordEncoder;
	private final OTPService otpService;
	private final EmailService emailService;
	
	@Transactional
	public SuperAdmin saveSuperAdmin(SuperAdminRegisterRequestDTO superAdminRegisterDTO) {
		SuperAdmin superAdmin = superAdminMapper.convertToSuperAdmin(superAdminRegisterDTO);
		superAdmin.setPassword(passwordEncoder.encode(superAdmin.getPassword()));
		superAdmin.setRole("SUPERADMIN");
		College college = collegeService.findByCollegeName(superAdmin.getCollege().getCollegeName()).orElseGet(() -> {
		College newCollege = College.builder()
										.address(superAdmin.getCollege().getAddress())
										.collegeName(superAdmin.getCollege().getCollegeName())
										.build();
			return collegeService.saveCollege(newCollege);
		});
		
		superAdmin.setCollege(college);
		return superAdminRepository.save(superAdmin);
	}
	
	@Transactional
	public SuperAdmin saveSuperAdmin(SuperAdmin superAdmin) {
		return superAdminRepository.save(superAdmin);
	}
	
	public SuperAdmin findAdminByEmailId(String emailId) {
		return superAdminRepository.findSuperAdminByEmailId(emailId)
					.orElseThrow(() -> new UsernameNotFoundException("Admin with username " + emailId + " was not found"));
	}
	
	
	public SuperAdmin findById(int id) {
		return superAdminRepository.findById(id).orElseThrow(() -> new SuperAdminNotFoundException("Super admin with id " + id + " was not found"));
	}

	
	public void sendOTP(String emailId) {
		String otp = otpService.generateOTP(emailId);
		Map<String, Object> extraParams = new HashMap<>();
		extraParams.put("otp", otp);
		MailSendDTO mailSendDTO = MailSendDTO.builder()
											.mailType(MailType.OtpVerification)
											.name("Admin")
											.extraParams(extraParams)
											.to(emailId)
											.build();
		
		emailService.sendMail(mailSendDTO);		
	}
	
	
	public void checkOTP(SuperAdminRegisterRequestDTO dto) {
		if(!otpService.checkOTP(dto.emailId(), dto.otp())) {
			throw new OTPValidationException("The otp is not valid");
		}
	}
	
}



