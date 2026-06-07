package com.placemate.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.placemate.dto.CollegeDTOs.CollegeSummaryDTO;
import com.placemate.entity.College;
import com.placemate.exceptions.CollegeNotFoundException;
import com.placemate.mapper.CollegeMapper;
import com.placemate.repository.jpa.CollegeRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class CollegeService {
	// methods to implement are:

	private CollegeMapper collegeMapper;
	private CollegeRepository collegeRepository;	
	
	@Transactional
	public void saveCollege(CollegeSummaryDTO collegeDTO) {
		College college = collegeMapper.getCollegeFrom(collegeDTO);
		collegeRepository.save(college);
	}
	
	@Transactional
	public College saveCollege(College college) {
		return collegeRepository.save(college);
	}
	
	public Optional<College> findByCollegeName(String collegeName) {
		return collegeRepository.findCollegeByCollegeName(collegeName);
	}
	
	
	public College findByCollegeId(int collegeId) {
		return collegeRepository.findById(collegeId).orElseThrow(() -> new CollegeNotFoundException("College with id " + collegeId + " was not found"));
	}
	
	
	public boolean existsCollegeId(int collegeId) {
		return collegeRepository.existsById(collegeId);
	}
}






