package com.placemate.repository.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import com.placemate.entity.Room;

import jakarta.persistence.LockModeType;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer>{
	
	Optional<List<Room>> findAllRoomByCollegeId(int collegeId);
		
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	Optional<Room> findRoomWithLockById(int roomId);
	
	Page<Room> findByCollege_IdAndRoomNameContainingIgnoreCase( int collegeId, String roomName, Pageable pageable);
	boolean existsByIdAndCollegeId(int id, int collegeId);
}
