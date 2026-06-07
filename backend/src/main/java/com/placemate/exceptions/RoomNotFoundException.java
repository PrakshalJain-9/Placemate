package com.placemate.exceptions;

public class RoomNotFoundException extends RuntimeException{

	public RoomNotFoundException(String message) {
		super(message);
	}
}
