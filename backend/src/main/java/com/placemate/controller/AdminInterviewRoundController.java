package com.placemate.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.placemate.dto.InterviewRoundDTOs.InterviewRoundCreateDTO;
import com.placemate.service.InterviewRoundService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
public class AdminInterviewRoundController {
	
	private InterviewRoundService interviewRoundService;
	
	@PostMapping("/interview-round")
	public ResponseEntity<?> saveInterviewRound(@RequestBody InterviewRoundCreateDTO interviewRound){
		return ResponseEntity.ok(interviewRoundService.saveInterviewRound(interviewRound));
	}
	
	@GetMapping("/interview-round/{id}")
	@PreAuthorize("@roundSecurity.isOwner(#interviewRoundId)")
	public ResponseEntity<?> findInterviewRound(@PathVariable("id") int interviewRoundId){
		return ResponseEntity.ok(interviewRoundService.findInterviewRoundById(interviewRoundId));
		
	}
	
	@DeleteMapping("/interview-round/{id}")
	@PreAuthorize("@roundSecurity.isOwner(#interviewRoundId)")
	public ResponseEntity<?> deleteInterviewRound(@PathVariable("id") int interviewRoundId){
		interviewRoundService.deleteInterviewRound(interviewRoundId);
		return ResponseEntity.ok().build();
	}
	
	@PatchMapping("/interview-round/{id}")
	@PreAuthorize("@roundSecurity.isOwner(#interviewRoundId)")
	public ResponseEntity<?> updateInterviewRound(@PathVariable("id") int interviewRoundId, @RequestBody InterviewRoundCreateDTO interviewRound){
		return ResponseEntity.ok(interviewRoundService.updateInterviewRoundSummary(interviewRoundId, interviewRound));
	}
	
	@GetMapping("/interview-round")
	public ResponseEntity<?> findPagedResult(Pageable pageable, @RequestParam(required = false) Integer companyId, @RequestParam(required = false, defaultValue = "") String interviewName){
		return ResponseEntity.ok(interviewRoundService.givePagedInterviewRound(pageable, companyId, interviewName));
	}
}











