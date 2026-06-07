package com.placemate.events.interviewschedule;

import com.placemate.dto.InterviewScheduleDTOs.InterviewScheduleSummaryDTO;

public class InterviewScheduleEvents  {
	
	public record InterviewScheduleCRUDEvent(InterviewScheduleSummaryDTO interviewSchedule, int collegeId, String broadcastMessage, String collegeName) {}
}

