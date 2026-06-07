package com.placemate.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.placemate.dto.SuperAdminDTOs.SuperAdminRegisterRequestDTO;
import com.placemate.entity.SuperAdmin;

@Mapper(componentModel = "spring", uses = CollegeMapper.class)
public interface SuperAdminMapper {

	
	@Mapping(source = "superAdminId", target = "id")
	@Mapping(source = "collegeDTO", target = "college")
	SuperAdmin convertToSuperAdmin(SuperAdminRegisterRequestDTO superAdminRegisterDTO);
	
}
