package com.placemate.listeners.interviewschedule;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.placemate.events.interviewschedule.InterviewScheduleEvents.InterviewScheduleCRUDEvent;
import com.placemate.service.ServerSentEventService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Component
public class InterviewScheduleListeners {

	private ServerSentEventService sseService;
	
	@Async
	@EventListener
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void interviewScheduleUpdatedEvent(InterviewScheduleCRUDEvent event) {
		sseService.broadcastToCollege(event.interviewSchedule(), event.broadcastMessage(), event.collegeId());
		
	}
	
}
