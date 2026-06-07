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

import com.placemate.dto.StudentDTOs.StudentCreateDTO;
import com.placemate.dto.StudentDTOs.StudentSummaryDTO;
import com.placemate.service.StudentService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@PreAuthorize("hasAuthority('SUPERADMIN')")
public class SuperAdminStudentController {

	private final StudentService studentService;
		
	@PostMapping("/superadmin/students")
	public ResponseEntity<?> addStudent(@Valid @RequestBody StudentCreateDTO studentDTO){
		StudentSummaryDTO student = studentService.addStudent(studentDTO);
		return ResponseEntity.ok(student);
	}
	
	
	@DeleteMapping("/superadmin/students/{id}")
	@PreAuthorize("@studentSecurity.isOwner(#studentId)")
	public ResponseEntity<?> deleteStudent(@PathVariable("id") int studentId){
		studentService.deleteStudent(studentId);
		return ResponseEntity.ok().build();
	}
	
		
	@PatchMapping("/superadmin/students/{id}")
	@PreAuthorize("@studentSecurity.isOwner(#studentId)")
	public ResponseEntity<?> changeStudentRole(@PathVariable("id") int studentId, @RequestBody StudentSummaryDTO dto){
		studentService.updateStudentRole(studentId, dto);
		return ResponseEntity.ok().build();
	}
	
	
	@GetMapping("/superadmin/students")
	public ResponseEntity<?> pagedStudentList(Pageable pageable, @RequestParam(name = "rollNumber", required = false, defaultValue = "") String rollNumber){
		return ResponseEntity.ok(studentService.findStudentByPage(pageable, rollNumber));
		
	}
	
	
	@PostMapping("/superadmin/reminder")
	public ResponseEntity<?> remindAllPendingStudentToJoin(){
		studentService.sendReminderMails();
		return ResponseEntity.accepted().build();
	}
}





