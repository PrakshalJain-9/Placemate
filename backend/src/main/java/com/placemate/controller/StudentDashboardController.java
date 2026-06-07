package com.placemate.controller;

import java.io.IOException;

import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.placemate.service.InterviewScheduleService;
import com.placemate.service.ServerSentEventService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@PreAuthorize("hasAnyAuthority('STUDENT', 'ADMIN', 'SUPERADMIN')")
@RequestMapping("/api/student/dashboard")
public class StudentDashboardController {
	
	
	private InterviewScheduleService interviewScheduleService;
	private ServerSentEventService SseService;

	
	@GetMapping("/rooms")
	public ResponseEntity<?> findActiveRooms(Pageable pageable){
		return ResponseEntity.ok(interviewScheduleService.findSortedRooms(pageable));
	}
	
	@GetMapping("/rooms/{id}/schedules/active")
	@PreAuthorize("@roomSecurity.isOwner(#roomId)")
	public ResponseEntity<?> findActiveScheduleForRoom(@PathVariable("id") int roomId, Pageable pageable){
		return ResponseEntity.ok(interviewScheduleService.findActiveInterviewScheduleForRoom(roomId, pageable));
	}
	
	@GetMapping("/rooms/{id}/schedules/past")
	@PreAuthorize("@roomSecurity.isOwner(#roomId)")
	public ResponseEntity<?> findPastScheduleForRoom(@PathVariable("id") int roomId, Pageable pageable){
		return ResponseEntity.ok(interviewScheduleService.findPastInterviewScheduleForRoom(roomId, pageable));
	}
	
	
	@GetMapping(value = "/stream-updates", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter getDashboard() throws IOException {
		SseEmitter emitter = SseService.addEmitter();
		emitter.send(SseEmitter.event()
								.name("INIT")
								.data("Connected to Placemate Live Updates", MediaType.APPLICATION_JSON));
			
		return emitter;	
	}
	
	@GetMapping("/students/{id}/schedules/active")
	@PreAuthorize("@studentSecurity.isOwner(#studentId)")
	public ResponseEntity<?> findIActiventerviewOfStudent(@PathVariable("id") int studentId, Pageable pageable){
		return ResponseEntity.ok(interviewScheduleService.findActiveInterviewScheduleForStudent(studentId, pageable));
	}
	
	
	
	@GetMapping("/students/{id}/schedules/past")
	@PreAuthorize("@studentSecurity.isOwner(#studentId)")
	public ResponseEntity<?> findPastInterviewOfStudent(@PathVariable("id") int studentId, Pageable pageable){
		return ResponseEntity.ok(interviewScheduleService.findPastInterviewScheduleForStudent(studentId, pageable));
	}
	
	
}




