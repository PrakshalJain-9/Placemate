package com.placemate.security.core;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@AllArgsConstructor
@Builder
@Data
@ToString
public class CustomPrincipal {
	private int userId;
	private String email;
	private String fullName;
	private String role;
	private int collegeId;
}
