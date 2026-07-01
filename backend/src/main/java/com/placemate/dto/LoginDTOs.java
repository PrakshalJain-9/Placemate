package com.placemate.dto;

import org.hibernate.validator.constraints.Length;

import lombok.Builder;
import lombok.With;
import lombok.extern.jackson.Jacksonized;

public class LoginDTOs {

	
	public interface LoginRequestDTO {
		String emailId();
		String password();
	}
	
	@Builder
	@With
	@Jacksonized
	public record SuperAdminLoginDTO(String emailId, String password) implements LoginRequestDTO{}
	
	@Builder
	@With
	@Jacksonized
	public record StudentLoginDTO(String emailId, String password) implements LoginRequestDTO{}
	
	@Builder
	@With
	@Jacksonized
	public record SetPasswordDTO(@Length(min = 8) String password, String token) {}
	
}
