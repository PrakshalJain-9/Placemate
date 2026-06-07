package com.placemate.dto;

import com.placemate.dto.CollegeDTOs.CollegeSummaryDTO;

import lombok.Builder;
import lombok.With;
import lombok.extern.jackson.Jacksonized;

public class SuperAdminDTOs {

	@Builder
	@Jacksonized
	@With
	public record SuperAdminRegisterRequestDTO(Integer superAdminId, String emailId, String password, String role, CollegeSummaryDTO collegeDTO, String otp) {}
	
	@Builder
	@With
	public record SuperAdminSummaryDTO(Integer superAdminId, String emailId, String role) {}
	
	@Builder
	@With
	public record SuperAdminDetailDTO(Integer superAdminId, String emailId, String password, String role, CollegeSummaryDTO collegeDTO) {}
	
	

}
