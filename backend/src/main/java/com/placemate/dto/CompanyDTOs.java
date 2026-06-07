package com.placemate.dto;

import lombok.Builder;
import lombok.With;
import lombok.extern.jackson.Jacksonized;

public class CompanyDTOs {
	
	@Builder
	@With
	public record CompanySummaryDTO(String companyName, Integer companyId, Long version) {}
	
	@Builder
	@With
	@Jacksonized
	public record CompanyNameQueryDTO(String companyName) {}

}
