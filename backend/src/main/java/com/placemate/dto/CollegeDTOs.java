package com.placemate.dto;

import java.util.List;

import com.placemate.dto.AddressDTOs.AddressDetailDTO;
import com.placemate.dto.InterviewScheduleDTOs.InterviewScheduleSummaryDTO;
import com.placemate.dto.RoomDTOs.RoomSummaryDTO;
import com.placemate.dto.StudentDTOs.StudentSummaryDTO;

import lombok.Builder;
import lombok.With;

public class CollegeDTOs {

	@Builder
	@With
	public record CollegeSummaryDTO(Integer collegeId, String collegeName, AddressDetailDTO address) {
	}

	@Builder
	@With
	public record CollegeDetailDTO(Integer collegeId, String collegeName, AddressDetailDTO address,
			List<RoomSummaryDTO> roomList, List<StudentSummaryDTO> studentList) {
	}

	@Builder
	@With
	public record CollegeInterviewScheduleDTO(List<InterviewScheduleSummaryDTO> content, int pageNumber, int pageSize, long totalElements, int totalPages) {
	}
}
