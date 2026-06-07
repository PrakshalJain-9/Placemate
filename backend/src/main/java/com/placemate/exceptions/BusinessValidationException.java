package com.placemate.exceptions;

public class BusinessValidationException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	
	public BusinessValidationException(String message) {
		super(message);
	}

}
