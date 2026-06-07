package com.placemate.exceptions;

public class UserNotAllowedException extends RuntimeException{

	public UserNotAllowedException(String message) {
		super(message);
	}
}
