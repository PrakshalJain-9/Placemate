package com.placemate.security.preauthorization;

import org.springframework.stereotype.Component;

import com.placemate.repository.jpa.StudentRepository;
import com.placemate.security.utils.SecurityUtils;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class StudentSecurity {

	private StudentRepository studentRepository;
	
	public boolean isOwner(int studentId) {
		int collegeId = SecurityUtils.getCollegeId();
		return studentRepository.existsByIdAndCollegeId(studentId, collegeId);
	}
}
