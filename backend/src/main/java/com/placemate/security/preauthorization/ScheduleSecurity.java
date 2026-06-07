package com.placemate.security.preauthorization;

import org.springframework.stereotype.Component;

import com.placemate.repository.jpa.InterviewScheduleRepository;
import com.placemate.security.utils.SecurityUtils;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class ScheduleSecurity {

	private final InterviewScheduleRepository interviewScheduleRepository;
	
	public boolean isOwner( int scheduleId) {
		int collegeId = SecurityUtils.getCollegeId();
		System.out.println(collegeId);
		return interviewScheduleRepository.existsByIdAndInterviewRound_College_Id(scheduleId, collegeId);
	}
	
}
