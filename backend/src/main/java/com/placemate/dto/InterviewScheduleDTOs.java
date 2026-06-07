package com.placemate.dto;

import java.time.LocalDateTime;

import com.placemate.dto.InterviewRoundDTOs.InterviewRoundSummaryDTO;
import com.placemate.dto.RoomDTOs.RoomSummaryDTO;
import com.placemate.dto.StudentDTOs.StudentSummaryDTO;
import com.placemate.entity.enums.InterviewStatus;

import lombok.Builder;
import lombok.With;
import lombok.extern.jackson.Jacksonized;

public class InterviewScheduleDTOs {

	@Builder
	@With
	public record InterviewScheduleSummaryDTO(Integer id, InterviewRoundSummaryDTO interviewRound, StudentSummaryDTO student, LocalDateTime startTime, RoomSummaryDTO room, InterviewStatus status, Long version) {}

	@Builder
	@With
	public record InterviewScheduleSummaryPerStudent(InterviewRoundSummaryDTO interviewRound, LocalDateTime startTime, RoomSummaryDTO room, InterviewStatus status) {}
	
	@Builder
	@With
	@Jacksonized
	public record InterviewScheduleCreateDTO(Integer interviewRoundId, Integer studentId, LocalDateTime startTime, Integer roomId, InterviewStatus status, Long version) {}
	
	@Builder
	@With
	@Jacksonized
	public record InterviewScheduleBulkCreateDTO(String companyName, String interviewName, String studentRollNumber, LocalDateTime startTime, String roomName, InterviewStatus status) {}
}

