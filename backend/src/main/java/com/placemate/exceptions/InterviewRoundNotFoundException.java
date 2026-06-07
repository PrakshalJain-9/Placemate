package com.placemate.exceptions;

public class InterviewRoundNotFoundException extends RuntimeException{

	private static final long serialVersionUID = 1L;

	public InterviewRoundNotFoundException(String message) {
		super(message);
	}
}
