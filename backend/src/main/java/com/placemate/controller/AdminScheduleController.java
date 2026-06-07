package com.placemate.controller;

import org.springframework.data.domain.Page;
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

import com.placemate.dto.InterviewScheduleDTOs.InterviewScheduleCreateDTO;
import com.placemate.dto.InterviewScheduleDTOs.InterviewScheduleSummaryDTO;
import com.placemate.service.InterviewScheduleService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
public class AdminScheduleController {
	
	private InterviewScheduleService interviewScheduleService;
	
	@PostMapping("/admin/schedules")
	ResponseEntity<?> addInterviewSchedule(@RequestBody InterviewScheduleCreateDTO interviewCreateDTO){
		return ResponseEntity.ok(interviewScheduleService.createInterviewSchedule(interviewCreateDTO));
	}
	
	@DeleteMapping("/admin/schedules/{id}")
	@PreAuthorize("@scheduleSecurity.isOwner(#interviewScheduleId)")
	ResponseEntity<?> deleteInterviewSchedule(@PathVariable("id") int interviewScheduleId){
		interviewScheduleService.deleteInterviewSchedule(interviewScheduleId);
		return ResponseEntity.ok().build();
	}
	
	@PutMapping("/admin/schedules/{id}")
	@PreAuthorize("@scheduleSecurity.isOwner(#interviewScheduleId)")
	ResponseEntity<?> updateInterviewSchedule(@PathVariable("id") int interviewScheduleId, @RequestBody InterviewScheduleCreateDTO interviewScheduleCreateDTO){
		return ResponseEntity.ok(interviewScheduleService.updateInterviewSchedule(interviewScheduleId, interviewScheduleCreateDTO));
	}
	
	
	@GetMapping("/admin/schedules")
    public ResponseEntity<Page<InterviewScheduleSummaryDTO>> omniSearchSchedules(@RequestParam(name = "q", defaultValue = "") String query,  Pageable pageable) {
        return ResponseEntity.ok(interviewScheduleService.googleQueryMethod(query, pageable));
    }
	
	@GetMapping("/admin/schedules/college")
	ResponseEntity<?> getAllInterviewScheduleForCollege(Pageable pageable){
		return ResponseEntity.ok(interviewScheduleService.findInterviewScheduleForCollege(pageable));
	}
		
	
}


