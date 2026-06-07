package com.placemate.security.preauthorization;

import org.springframework.stereotype.Component;

import com.placemate.repository.jpa.RoomRepository;
import com.placemate.security.utils.SecurityUtils;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class RoomSecurity {
	
	private RoomRepository roomRepository;
	
	public boolean isOwner(int roomId) {
		int collegeId = SecurityUtils.getCollegeId();
		return roomRepository.existsByIdAndCollegeId(roomId, collegeId);
		
		
	}
}
