package com.placemate.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.placemate.dto.CompanyDTOs.CompanySummaryDTO;
import com.placemate.entity.Company;

@Mapper(componentModel = "spring")
public interface CompanyMapper {

	@Mapping(source = "companyId", target = "id")
	Company getCompanyFrom(CompanySummaryDTO companySummaryDTO);
	
	
	@Mapping(source = "id", target = "companyId")
	CompanySummaryDTO getCompanySummaryDTOFrom(Company company);
}
