package com.placemate.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.placemate.service.StudentService;

import lombok.AllArgsConstructor;


@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
public class AdminStudentController {
	
	private StudentService studentService;
	
	@GetMapping("/students")
	public ResponseEntity<?> pagedStudentList(Pageable pageable, @RequestParam(name = "rollNumber", required = false, defaultValue = "") String rollNumber){
		return ResponseEntity.ok(studentService.findStudentByPage(pageable, rollNumber));
		
	}
}
