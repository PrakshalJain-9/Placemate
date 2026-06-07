package com.placemate.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.placemate.dto.StudentDTOs.StudentCreateDTO;
import com.placemate.dto.StudentDTOs.StudentSummaryDTO;
import com.placemate.entity.College;
import com.placemate.entity.Student;
import com.placemate.entity.enums.StudentStatus;
import com.placemate.events.student.StudentEvents.OnBoardinReminderRequestedEvent;
import com.placemate.events.student.StudentEvents.StudentCreatedEvent;
import com.placemate.exceptions.StudentNotFoundException;
import com.placemate.mapper.StudentMapper;
import com.placemate.repository.jpa.StudentRepository;
import com.placemate.security.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentService {

	private final CollegeService collegeService;
	private final StudentMapper studentMapper;
	private final StudentRepository studentRepository;
	@Value("{student.not.found.message}")
	private String studentNotFoundTemplate;
	
	private final ApplicationEventPublisher eventPublisher;
	
	
	@Transactional
	public Student saveStudent(Student student) {
		return studentRepository.save(student);
	}
	public Student findStudentByRollNumber(String rollNumber, int collegeId) {
		return studentRepository.findByRollNumberAndCollegeId(rollNumber, collegeId);
	}
	
	
	
	public Student findStudentByEmailId(String emailId) {
		return studentRepository.findStudentByEmailId(emailId)
								.orElseThrow(() -> 
								new UsernameNotFoundException("User with username " + emailId + " was not found."));
	}
	
	
	public Student findStudentById(int id) {
		return studentRepository.findById(id).orElseThrow(() -> new StudentNotFoundException(String.format(studentNotFoundTemplate, id)));
	}
	
	
	@Transactional
	public StudentSummaryDTO addStudent(StudentCreateDTO registerRequest) {
		Student student = studentMapper.getStudentFrom(registerRequest);
		if(student.getRole() == null) student.setRole("Student".toUpperCase());
		else student.setRole(student.getRole().toUpperCase());
		student.setStatus(StudentStatus.NOTJOINED);
		int collegeId = SecurityUtils.getCollegeId();
		College college = collegeService.findByCollegeId(collegeId);
		college.addStudent(student);
		
		StudentSummaryDTO studentDTO = studentMapper.getStudentDTOFrom(student);
		eventPublisher.publishEvent(new StudentCreatedEvent(studentDTO, college));
		return studentMapper.getStudentDTOFrom(studentRepository.save(student));
	}
	
	@Transactional
	public void deleteStudent(int studentId) {
		int collegeId = SecurityUtils.getCollegeId();
		College college = collegeService.findByCollegeId(collegeId);
		college.deleteStudent(studentRepository.findById(studentId).orElseThrow(() -> new StudentNotFoundException(String.format(studentNotFoundTemplate, studentId))));
		
	}
		
	
	@Transactional
	public void updateStudentRole(int studentId, StudentSummaryDTO dto) {
		Student student = studentRepository.findById(studentId).orElseThrow(() ->
		new StudentNotFoundException(String.format(studentNotFoundTemplate, studentId)));
		
		
		if(dto.role().equalsIgnoreCase("admin")) student.setRole("ADMIN");
		else if(dto.role().equalsIgnoreCase("user")) student.setRole("STUDENT");
		else throw new IllegalStateException();
		
		
		studentRepository.save(student);
	}

	
	public Page<StudentSummaryDTO> findStudentByPage(Pageable pageable, String rollNumber) {
		return studentRepository.findByRollNumberContainingIgnoreCase(rollNumber, pageable).map(studentMapper::getStudentDTOFrom);
	}
	
	public void sendReminderMails() {
		int collegeId = SecurityUtils.getCollegeId();
		List<Student> yetToJoinStudents = studentRepository.findByStatusAndCollege_Id(StudentStatus.NOTJOINED, collegeId);
		College college = collegeService.findByCollegeId(collegeId);
		
		eventPublisher.publishEvent(new OnBoardinReminderRequestedEvent(yetToJoinStudents, college.getCollegeName()));
	}
}




