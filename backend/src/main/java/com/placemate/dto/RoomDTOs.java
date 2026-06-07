package com.placemate.dto;

import com.placemate.dto.CollegeDTOs.CollegeSummaryDTO;

import lombok.Builder;
import lombok.With;
import lombok.extern.jackson.Jacksonized;

public class RoomDTOs {

	@Builder
	@With
	public record RoomSummaryDTO(Integer roomId, String roomName, int capacity, Long version) {}
	@Builder
	@With
	public record RoomDetailDTO(Integer roomId, String roomName, int capacity, CollegeSummaryDTO college) {}
	
	@Builder
	@With
	@Jacksonized
	public record RoomCreateDTO(String roomName, int capacity) {}
}
