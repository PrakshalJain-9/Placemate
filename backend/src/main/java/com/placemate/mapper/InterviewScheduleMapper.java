package com.placemate.mapper;

import org.mapstruct.Mapper;

import com.placemate.dto.InterviewScheduleDTOs.InterviewScheduleSummaryDTO;
import com.placemate.entity.InterviewSchedule;

@Mapper(componentModel = "spring", uses = {CollegeMapper.class, CompanyMapper.class, InterviewRoundMapper.class, RoomMapper.class, StudentMapper.class})
public interface InterviewScheduleMapper {
	
	InterviewScheduleSummaryDTO findInterviewScheduleSummaryFrom(InterviewSchedule interviewSchedule);
}
