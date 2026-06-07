package com.placemate.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.placemate.dto.CollegeDTOs.CollegeDetailDTO;
import com.placemate.dto.CollegeDTOs.CollegeSummaryDTO;
import com.placemate.entity.College;

@Mapper(componentModel = "spring")
public interface CollegeMapper {
	
	@Mapping(source = "collegeId", target = "id")
	public College getCollegeFrom(CollegeSummaryDTO collegeDTO);
	
	@Mapping(source = "id", target = "collegeId")
	public CollegeSummaryDTO getCollegeDTOFrom(College college);
	
	@Mapping(source = "collegeId", target = "id")
	public College getCollegeFrom(CollegeDetailDTO collegeDTO);
}
