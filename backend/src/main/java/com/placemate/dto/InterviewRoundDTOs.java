package com.placemate.dto;

import com.placemate.dto.CompanyDTOs.CompanySummaryDTO;

import lombok.Builder;
import lombok.With;
import lombok.extern.jackson.Jacksonized;

public class InterviewRoundDTOs {

	@Builder
	@With
	public record InterviewRoundSummaryDTO(Integer id, String interviewName, int durationInMinutes, CompanySummaryDTO company) {}
	
	@Builder
	@With
	@Jacksonized
	public record InterviewRoundCreateDTO(Integer id, String interviewName, int durationInMinutes, Integer companyId) {}
	
	@Builder
	@With
	@Jacksonized
	public record InterviewRoundQueryDTO(String interviewName, Integer companyId) {}
}
