package com.placemate.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.placemate.dto.InterviewRoundDTOs.InterviewRoundCreateDTO;
import com.placemate.dto.InterviewRoundDTOs.InterviewRoundSummaryDTO;
import com.placemate.entity.College;
import com.placemate.entity.InterviewRound;
import com.placemate.exceptions.InterviewRoundNotFoundException;
import com.placemate.mapper.InterviewRoundMapper;
import com.placemate.repository.jpa.InterviewRepository;
import com.placemate.security.utils.SecurityUtils;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class InterviewRoundService {

	private InterviewRepository interviewRepository;
	private InterviewRoundMapper interviewRoundMapper;
	private CollegeService collegeService;
	private CompanyService companyService;
	
	public InterviewRound findInterviewRoundById(int interviewRoundId) {
		return interviewRepository.findById(interviewRoundId).orElseThrow(() -> new InterviewRoundNotFoundException("Round not found"));
	}
	
	@Transactional
	public InterviewRoundSummaryDTO saveInterviewRound(InterviewRoundCreateDTO interviewRoundDTO) {
		College college = collegeService.findByCollegeId(SecurityUtils.getCollegeId());
		InterviewRound interviewRound = interviewRoundMapper.findInterviewRoundFrom(interviewRoundDTO);
		interviewRound.setCollege(college);
		interviewRound.setCompany(companyService.findCompanyEntityById(interviewRoundDTO.companyId()));
		return interviewRoundMapper.findSummaryDTOFrom(interviewRepository.save(interviewRound));
	}
	
	
	public InterviewRoundSummaryDTO findInterviewRoundSummaryDTOById(int interviewRoundId) {
		InterviewRound round = findInterviewRoundEntityBy(interviewRoundId);
		return interviewRoundMapper.findSummaryDTOFrom(round);
	}
	
	@Transactional
	public void deleteInterviewRound(int interviewRoundId) {
		interviewRepository.deleteById(interviewRoundId);
	}
	
	@Transactional
	public InterviewRoundSummaryDTO updateInterviewRoundSummary(int interviewRoundId, InterviewRoundCreateDTO interviewRoundDTO) {
		InterviewRound interviewRound = findInterviewRoundEntityBy(interviewRoundId);
		interviewRound.setDurationInMinutes(interviewRoundDTO.durationInMinutes());
		interviewRound.setInterviewName(interviewRoundDTO.interviewName());
		return interviewRoundMapper.findSummaryDTOFrom(interviewRepository.save(interviewRound));
		
	}
	
	public Page<InterviewRoundSummaryDTO> givePagedInterviewRound(Pageable pageable, Integer comapnyId, String interviewName){
		return interviewRepository.findRoundsWithOptionalFilters(SecurityUtils.getCollegeId(), comapnyId, interviewName, pageable).map(interviewRoundMapper::findSummaryDTOFrom);
	}
	
	
	public InterviewRound findInterviewRoundEntityBy(int interviewRoundId) {
		return interviewRepository.findById(interviewRoundId).orElseThrow(() -> new InterviewRoundNotFoundException("Interview Round not Found"));

	}
	
}

