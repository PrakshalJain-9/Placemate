package com.placemate.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.placemate.dto.StudentDTOs.StudentCreateDTO;
import com.placemate.dto.StudentDTOs.StudentSummaryDTO;
import com.placemate.entity.Student;

@Mapper(componentModel = "spring")
public interface StudentMapper {
	
	@Mapping(source = "email", target = "emailId")
	@Mapping(target = "password", ignore = true)
	@Mapping(target = "college", ignore = true)
	@Mapping(target = "status", ignore = true)
	public Student getStudentFrom(StudentCreateDTO dto);
	
	@Mapping(source = "emailId", target = "email")
	@Mapping(source = "college.id", target = "collegeId")
	public StudentSummaryDTO getStudentDTOFrom(Student student);
	
	@Mapping(source = "email", target = "emailId")
	public Student getStudentFrom(StudentSummaryDTO dto);
	
	
	public List<StudentSummaryDTO> getDTOListFrom(List<Student> studentList);
}
