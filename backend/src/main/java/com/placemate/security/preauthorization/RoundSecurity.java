package com.placemate.security.preauthorization;

import org.springframework.stereotype.Component;

import com.placemate.repository.jpa.InterviewRepository;
import com.placemate.security.utils.SecurityUtils;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class RoundSecurity {

	private InterviewRepository interviewRepository;
	
	public boolean isOwner(int interviewRoundId) {
		int collegeId = SecurityUtils.getCollegeId();
		return interviewRepository.existsByIdAndCollegeId(interviewRoundId, collegeId);
	}
}
