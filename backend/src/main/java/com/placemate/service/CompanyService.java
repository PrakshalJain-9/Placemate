package com.placemate.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.placemate.dto.CompanyDTOs.CompanySummaryDTO;
import com.placemate.entity.Company;
import com.placemate.exceptions.CompanyNotFoundException;
import com.placemate.mapper.CompanyMapper;
import com.placemate.repository.jpa.CompanyRepository;
import com.placemate.security.utils.SecurityUtils;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {
	
	private CompanyRepository companyRepository;
	private CompanyMapper companyMapper;
	private CollegeService college;
	
	@Transactional
	public CompanySummaryDTO saveCompany(CompanySummaryDTO companySummaryDTO) {
		Company company = companyMapper.getCompanyFrom(companySummaryDTO);
		company.setCollege(college.findByCollegeId(SecurityUtils.getCollegeId()));
		return companyMapper.getCompanySummaryDTOFrom(companyRepository.save(company));
	}
	
	
	public CompanySummaryDTO findCompanyById(int companyId) {
		Company company = findCompanyEntityById(companyId);
		return companyMapper.getCompanySummaryDTOFrom(company);
	}
	
	@Transactional
	public void deleteCompany(int companyId) {
		Company company = findCompanyEntityById(companyId);
		companyRepository.delete(company);
	}
	
	@Transactional
	public CompanySummaryDTO updateCompanyDetails(int companyId, CompanySummaryDTO companySummary) {
		Company company = findCompanyEntityById(companyId);
		
		if(companySummary.version() != company.getVersion()) {
			throw new ObjectOptimisticLockingFailureException(Company.class, company.getId());
		}
		company.setCompanyName(companySummary.companyName());
		company = companyRepository.save(company);
	
		return companyMapper.getCompanySummaryDTOFrom(company);
	}
	
	public Page<CompanySummaryDTO> findPagedCompanyList(String companyName, Pageable pageable){
		Page<CompanySummaryDTO> page = companyRepository.findByCompanyNameContainingIgnoreCaseAndCollege_Id(companyName, SecurityUtils.getCollegeId(), pageable).map(companyMapper::getCompanySummaryDTOFrom);
		return page;
	}
	
	
	public Company findCompanyEntityById(int companyId) {
		return companyRepository.findById(companyId).orElseThrow(() -> new CompanyNotFoundException("Company was not found"));
	}
}
