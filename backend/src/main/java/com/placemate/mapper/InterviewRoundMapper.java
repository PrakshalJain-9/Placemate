package com.placemate.mapper;

import org.mapstruct.Mapper;

import com.placemate.dto.InterviewRoundDTOs.InterviewRoundCreateDTO;
import com.placemate.dto.InterviewRoundDTOs.InterviewRoundSummaryDTO;
import com.placemate.entity.InterviewRound;

@Mapper(componentModel = "spring", uses = CompanyMapper.class)
public interface InterviewRoundMapper {
	
	public InterviewRoundSummaryDTO findSummaryDTOFrom(InterviewRound interviewRound);
	
	public InterviewRound findInterviewRoundFrom(InterviewRoundSummaryDTO interviewRoundSummary);
	public InterviewRound findInterviewRoundFrom(InterviewRoundCreateDTO interviewRound);

}



