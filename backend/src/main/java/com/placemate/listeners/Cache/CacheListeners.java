package com.placemate.listeners.Cache;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.placemate.events.interviewschedule.InterviewScheduleEvents.InterviewScheduleCRUDEvent;

import lombok.AllArgsConstructor;


@Component
@AllArgsConstructor
public class CacheListeners {

	private CacheManager cacheManager;
	
	
	@EventListener
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void scheduleChangedEvent(InterviewScheduleCRUDEvent event) {
		int studentId = event.interviewSchedule().student().id();
		int collegeId = event.collegeId();	
		Cache studentScheduleCache = cacheManager.getCache("studentInterviewSchedule");
		Cache collegeScheduleCache = cacheManager.getCache("collegeInterviewSchedule");
		if(studentScheduleCache != null) {
			studentScheduleCache.evict(studentId);
		}
		
		if(collegeScheduleCache != null) {
			collegeScheduleCache.evict(collegeId);
		}
	}
}
