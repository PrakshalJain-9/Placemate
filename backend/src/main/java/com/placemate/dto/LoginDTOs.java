package com.placemate.dto;

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
	public record SetPasswordDTO(String password, String token) {}
	
}
