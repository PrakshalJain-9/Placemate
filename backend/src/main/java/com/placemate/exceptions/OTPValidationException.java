package com.placemate.exceptions;

public class OTPValidationException extends RuntimeException{
	
	public OTPValidationException(String message) {
		super(message);
	}
}
