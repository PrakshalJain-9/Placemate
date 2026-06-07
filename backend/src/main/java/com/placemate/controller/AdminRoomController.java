package com.placemate.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.placemate.dto.RoomDTOs.RoomCreateDTO;
import com.placemate.dto.RoomDTOs.RoomSummaryDTO;
import com.placemate.service.RoomService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
public class AdminRoomController {

	private RoomService roomService;
	
	@PostMapping("/admin/room")
	public ResponseEntity<?> addRoom(@RequestBody RoomCreateDTO roomDTO){
		return ResponseEntity.ok(roomService.createRoom(roomDTO));
	}
	
	@DeleteMapping("/admin/room/{id}")
	@PreAuthorize("@roomSecurity.isOwner(#roomId)")
	public ResponseEntity<?> deleteRoomById(@PathVariable("id") int roomId){
		roomService.deleteRoom(roomId);
		return ResponseEntity.ok().build();
	}
	
	
	@PutMapping("/admin/room/{id}")
	@PreAuthorize("@roomSecurity.isOwner(#roomId)")
	public ResponseEntity<?> updateRoom(@PathVariable("id") int roomId, @RequestBody RoomSummaryDTO roomDTO){
		return ResponseEntity.ok(roomService.updateRoom(roomId, roomDTO));
	}
	
	
	@GetMapping("/admin/room")
	public ResponseEntity<?> getPagedRoom(@RequestParam(required = false, defaultValue = "") String roomName, Pageable pageable){
		return ResponseEntity.ok(roomService.findPagedRoomDTO(roomName, pageable));
	}
	
	
}







