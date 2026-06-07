package com.placemate.dto;

import java.util.Map;

import com.placemate.entity.enums.MailType;

import lombok.Builder;
import lombok.With;
import lombok.extern.jackson.Jacksonized;

public class EmailDTOs {

	@Builder
	@With
	@Jacksonized
	public record EmailRequestDTO(String email) {}
	
	@Builder
	@With
	@Jacksonized
	public record EmailOTPValidationRequestDTO(String email, String otp) {}
	
	
	@Builder
	@With
	@Jacksonized
	public record MailSendDTO(MailType mailType, String to, String name, String collegeName, Map<String, Object> extraParams) {}
	
	
}
