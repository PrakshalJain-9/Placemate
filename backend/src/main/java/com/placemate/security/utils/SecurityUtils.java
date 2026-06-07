package com.placemate.security.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.placemate.security.core.CustomPrincipal;

public class SecurityUtils {
	
	
	public static CustomPrincipal getPrincipal() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if(authentication != null && authentication.getPrincipal() instanceof CustomPrincipal) {
			return (CustomPrincipal) authentication.getPrincipal();
		}
		
		throw new IllegalStateException("No authenticated user found in the security context");
	}
	
	public static int getUserId() {
		return getPrincipal().getUserId();
	}
	
	public static String getEmail() {
		return getPrincipal().getEmail();
	}
	
	public static String getFullName() {
		return getPrincipal().getFullName();
	}
	
	
	public static String getRole() {
		return getPrincipal().getRole();
	}
	
	public static int getCollegeId() {
		return getPrincipal().getCollegeId();
	}
	
}
