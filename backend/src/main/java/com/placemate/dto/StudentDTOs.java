package com.placemate.dto;

import com.placemate.dto.CollegeDTOs.CollegeSummaryDTO;
import com.placemate.entity.enums.StudentStatus;

import lombok.Builder;
import lombok.With;
import lombok.extern.jackson.Jacksonized;

public class StudentDTOs {

	@Builder 
	@With
	public record StudentCreateDTO(Integer id, String email, String rollNumber, String name, String role, Integer collegeId) {}
	
	@Builder 
	@Jacksonized
	@With
	public record StudentSummaryDTO(Integer id, String email, String rollNumber, String name, String role, Integer collegeId, StudentStatus status) {}
	
	
	@Builder 
	@With
	public record StudentDetailsDTO(Integer id, String email, String rollNumber, String name, String role, CollegeSummaryDTO collegeDTO, StudentStatus status) {};


}
