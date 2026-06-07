package com.placemate.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum MailType {

	Welcome("Invitation To Join Placemate", "Welcome.ftlh"),
	Modify("Schedule Update in Placemate","Modify.ftlh"),
	Reminder("Reminder To Join Placemate", "Reminder.ftlh"),
	OtpVerification("Email Verification", "OtpVerification.ftlh");
	
	String subject;
	String templateFileName;
}
