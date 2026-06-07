package com.placemate.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.placemate.dto.RoomDTOs.RoomCreateDTO;
import com.placemate.dto.RoomDTOs.RoomSummaryDTO;
import com.placemate.entity.College;
import com.placemate.entity.Room;
import com.placemate.entity.Room.RoomBuilder;
import com.placemate.exceptions.CollegeNotFoundException;
import com.placemate.exceptions.RoomNotFoundException;
import com.placemate.mapper.RoomMapper;
import com.placemate.repository.jpa.RoomRepository;
import com.placemate.security.utils.SecurityUtils;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class RoomService {
	
	private RoomRepository roomRepository;
	private CollegeService collegeService;
	private RoomMapper roomMapper;
	
	@Transactional
	public RoomSummaryDTO createRoom(RoomCreateDTO roomCreateDTO) {
		RoomBuilder roomBuilder = Room.builder().capacity(roomCreateDTO.capacity()).roomName(roomCreateDTO.roomName());
		College college = collegeService.findByCollegeId(SecurityUtils.getCollegeId());
		roomBuilder.college(college);
		Room room = roomBuilder.build();
		room = roomRepository.save(room);
		RoomSummaryDTO dto = roomMapper.getRoomDTOFrom(room);
		return dto;
	}
	
	
	@Transactional
	public void deleteRoom(int roomId) {
		roomRepository.deleteById(roomId);
	}
	
	
	public List<RoomSummaryDTO> findRoomByCollegeId(int college_id){
		List<Room> rooms = roomRepository.findAllRoomByCollegeId(college_id).orElseThrow(() -> new CollegeNotFoundException("College with the college id " + String.valueOf(college_id) + " does not exists"));
		return rooms.stream().map(roomMapper::getRoomDTOFrom).toList();
	}
	

	
	public Room findByRoomId(int roomId) {
		return roomRepository.findById(roomId).orElseThrow(() -> new RoomNotFoundException("Room with room id " + roomId + " was not found."));
	}
	
	
	@Transactional(propagation = Propagation.MANDATORY)
	public Room findRoomWithLock(int roomId) {
		return roomRepository.findRoomWithLockById(roomId).orElseThrow(() -> new RoomNotFoundException("Room with room id " + roomId + " was not found."));
	}
	
	
	@Transactional
	public RoomSummaryDTO updateRoom(int roomId, RoomSummaryDTO roomSummary) {
		Room room = roomRepository.findById(roomId).orElseThrow(() -> new RoomNotFoundException("Room with room id " + roomId + " was not found."));
		
		if(roomSummary.version() != room.getVersion()) {
			throw new ObjectOptimisticLockingFailureException(Room.class, roomId);
		}
		room.setCapacity(roomSummary.capacity());
		room.setRoomName(roomSummary.roomName());
		return roomMapper.getRoomDTOFrom(roomRepository.save(room));
	}
	
	
	public Page<RoomSummaryDTO> findPagedRoomDTO(String roomName, Pageable pageable){
		return roomRepository.findByCollege_IdAndRoomNameContainingIgnoreCase(SecurityUtils.getCollegeId(), roomName, pageable).map(roomMapper::getRoomDTOFrom);
	}
	
	
}






