package com.placemate.dto;

import lombok.Builder;
import lombok.With;

public class TokenDTOs {

	@Builder
	@With
	public record RefreshTokenRequestDTO(String refreshToken) {}
	
	@Builder
	@With
	public record TokenPairDTO(String accessToken, String refreshToken) {}
}

