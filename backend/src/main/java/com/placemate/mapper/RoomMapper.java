package com.placemate.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.placemate.dto.RoomDTOs.RoomDetailDTO;
import com.placemate.dto.RoomDTOs.RoomSummaryDTO;
import com.placemate.entity.Room;

@Mapper(componentModel = "spring")
public interface RoomMapper {
	
	@Mapping(source = "roomId", target = "id")
	public Room getRoomFrom(RoomSummaryDTO roomDTO);
	
	@Mapping(source = "id", target = "roomId")
	public RoomSummaryDTO getRoomDTOFrom(Room room);
	
	
	@Mapping(source = "id", target = "roomId")
	@Mapping(source = "college.id", target = "college.collegeId")
	public RoomDetailDTO getRoomDetailDTOFrom(Room room);
}
