package com.placemate.listeners.notification;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.placemate.dto.EmailDTOs.MailSendDTO;
import com.placemate.dto.StudentDTOs.StudentSummaryDTO;
import com.placemate.entity.enums.MailType;
import com.placemate.events.student.StudentEvents.StudentCreatedEvent;
import com.placemate.service.EmailService;

import lombok.AllArgsConstructor;



@AllArgsConstructor
@Component
public class EmailNotificationEventListener {
	
	private EmailService emailService;
	
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleStudentCreatedEvent(StudentCreatedEvent event) {
		StudentSummaryDTO student = event.studentSummaryDTO();
		System.out.println(student.email());
		MailSendDTO mailDTO = MailSendDTO.builder()
									.name(student.name())
									.mailType(MailType.Welcome)
									.to(student.email())
									.collegeName(event.college().getCollegeName())
									.build();
		String info = emailService.sendMail(mailDTO);		
		System.out.println(info);
	}
}
