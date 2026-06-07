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

import com.placemate.dto.CompanyDTOs.CompanySummaryDTO;
import com.placemate.service.CompanyService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
public class AdminCompanyController {
	
	private CompanyService companyService;
	
	@PostMapping("/company")
	public ResponseEntity<?> addCompany(@RequestBody CompanySummaryDTO companySummary){
		return ResponseEntity.ok(companyService.saveCompany(companySummary));
	}
	
	@GetMapping("/company/{id}")
	@PreAuthorize("@companySecurity.isOwner(#companyId)")
	public ResponseEntity<?> findCompanyById(@PathVariable("id") int companyId){
		return ResponseEntity.ok(companyService.findCompanyById(companyId));
	}
	
	
	@PatchMapping("/company/{id}")
	@PreAuthorize("@companySecurity.isOwner(#companyId)")
	public ResponseEntity<?> updateCompanyById(@PathVariable("id") int companyId, @RequestBody CompanySummaryDTO companySummary){
		return ResponseEntity.ok(companyService.updateCompanyDetails(companyId, companySummary));
	}
	
	
	@DeleteMapping("/company/{id}")
	@PreAuthorize("@companySecurity.isOwner(#companyId)")
	public ResponseEntity<?> deleteCompanyById(@PathVariable("id") int companyId){
		companyService.deleteCompany(companyId);
		return ResponseEntity.ok().build();
	}
	
	@GetMapping("/company")	
	public ResponseEntity<?> findCompanyPageResult(Pageable pageable, @RequestParam(name = "companyName", required = false, defaultValue = "") String companyName){
		return ResponseEntity.ok(companyService.findPagedCompanyList(companyName, pageable));
	}
	
}
