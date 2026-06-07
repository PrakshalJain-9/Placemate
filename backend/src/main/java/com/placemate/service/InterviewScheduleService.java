package com.placemate.service;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.placemate.dto.CollegeDTOs.CollegeInterviewScheduleDTO;
import com.placemate.dto.InterviewScheduleDTOs.InterviewScheduleCreateDTO;
import com.placemate.dto.InterviewScheduleDTOs.InterviewScheduleSummaryDTO;
import com.placemate.dto.RoomDTOs.RoomSummaryDTO;
import com.placemate.entity.College;
import com.placemate.entity.InterviewRound;
import com.placemate.entity.InterviewSchedule;
import com.placemate.entity.Room;
import com.placemate.entity.Student;
import com.placemate.entity.enums.InterviewStatus;
import com.placemate.events.interviewschedule.InterviewScheduleEvents.InterviewScheduleCRUDEvent;
import com.placemate.exceptions.BusinessValidationException;
import com.placemate.exceptions.InterviewScheduleNotFoundException;
import com.placemate.mapper.InterviewScheduleMapper;
import com.placemate.mapper.RoomMapper;
import com.placemate.repository.jpa.InterviewScheduleRepository;
import com.placemate.security.utils.SecurityUtils;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class InterviewScheduleService {

	private InterviewScheduleRepository interviewScheduleRepository;
	private InterviewScheduleMapper interviewScheduleMapper;
	private InterviewRoundService interviewRoundService;
	private StudentService studentService;
	private RoomService roomService;
	private CollegeService collegeService;
	private RoomMapper roomMapper;
	private ApplicationEventPublisher publisher;
	

	
	@Transactional
	public InterviewScheduleSummaryDTO createInterviewSchedule(InterviewScheduleCreateDTO interviewCreateDTO) {
		Room room = roomService.findRoomWithLock(interviewCreateDTO.roomId());
		
		if(interviewScheduleRepository.existsByStartTimeAndRoom_Id(interviewCreateDTO.startTime(), room.getId())) {
			throw new BusinessValidationException("This room is already booked for this time.");
		}
		
		
		if(interviewScheduleRepository.existsByStartTimeAndStudent_Id(interviewCreateDTO.startTime(),interviewCreateDTO.studentId())) {
			throw new BusinessValidationException("This student already has an interview at this time.");
		}
		
		
		InterviewRound interviewRound = interviewRoundService.findInterviewRoundById(interviewCreateDTO.interviewRoundId());
		Student student = studentService.findStudentById(interviewCreateDTO.studentId());
		
		InterviewSchedule interviewSchedule = InterviewSchedule.builder()
															   .interviewRound(interviewRound)
															   .student(student)
															   .room(room)
															   .startTime(interviewCreateDTO.startTime())
															   .status(interviewCreateDTO.status())
															   .build();

		InterviewScheduleSummaryDTO interviewDTO = interviewScheduleMapper.findInterviewScheduleSummaryFrom(interviewScheduleRepository.save(interviewSchedule));
		int collegeId = SecurityUtils.getCollegeId();
		College college = collegeService.findByCollegeId(collegeId);
		publisher.publishEvent(new InterviewScheduleCRUDEvent(interviewDTO, SecurityUtils.getCollegeId(), "CREATE_INTERVIEW_SCHEDULE", college.getCollegeName()));
		
		return interviewDTO;
	}
	
	
	@Transactional
	public void deleteInterviewSchedule(int id) {
		InterviewSchedule interviewSchedule = interviewScheduleRepository.findById(id).orElseThrow(() -> new InterviewScheduleNotFoundException("Interview Schedule was not found "));
		interviewScheduleRepository.deleteById(id);
		InterviewScheduleSummaryDTO dto = interviewScheduleMapper.findInterviewScheduleSummaryFrom(interviewSchedule);
		int collegeId = SecurityUtils.getCollegeId();
		College college = collegeService.findByCollegeId(collegeId);
		publisher.publishEvent(new InterviewScheduleCRUDEvent(dto, SecurityUtils.getCollegeId(), "DELETE_INTERVIEW_SCHEDULE", college.getCollegeName()));
	}
	
	
	@Transactional
	public InterviewScheduleSummaryDTO updateInterviewSchedule(int interviewScheduleId, InterviewScheduleCreateDTO interviewCreateDTO) {
		InterviewSchedule interviewSchedule = interviewScheduleRepository.findById(interviewScheduleId).orElseThrow(
				() -> new InterviewScheduleNotFoundException("Interview Schedule with id " + interviewScheduleId + " was not found."));
		
		if(interviewSchedule.getVersion() != interviewCreateDTO.version()) {
			throw new ObjectOptimisticLockingFailureException(InterviewSchedule.class, interviewSchedule.getId());
		}
		
		
		InterviewRound interviewRound = interviewRoundService.findInterviewRoundById(interviewCreateDTO.interviewRoundId());
		Student student = studentService.findStudentById(interviewCreateDTO.studentId());
		Room room = roomService.findByRoomId(interviewCreateDTO.roomId());

		
		
		interviewSchedule.setInterviewRound(interviewRound);
		interviewSchedule.setRoom(room);
		interviewSchedule.setStudent(student);
		interviewSchedule.setStartTime(interviewCreateDTO.startTime());
		interviewSchedule.setStatus(interviewCreateDTO.status());
		
		InterviewScheduleSummaryDTO dto = interviewScheduleMapper.findInterviewScheduleSummaryFrom(interviewScheduleRepository.save(interviewSchedule));
		int collegeId = SecurityUtils.getCollegeId();
		College college = collegeService.findByCollegeId(collegeId);
		publisher.publishEvent(new InterviewScheduleCRUDEvent(dto, collegeId, "UPDATE_INTERVIEW_SCHEDULE", college.getCollegeName()));
		return dto;
	}
	
	public Page<InterviewScheduleSummaryDTO> googleQueryMethod(String query, Pageable pageable){
		int collegeId = SecurityUtils.getCollegeId();
		return interviewScheduleRepository.searchSchedulesGlobally(query, collegeId, pageable).map(interviewScheduleMapper::findInterviewScheduleSummaryFrom);
	}
	
	// These are the method for the analytics
	
	
	public Page<RoomSummaryDTO> findSortedRooms(Pageable pageable){
		int collegeId = SecurityUtils.getCollegeId();
		return interviewScheduleRepository.findActiveRoomsSortedByNextSchedule(
				collegeId,
				List.of(InterviewStatus.InProcess, InterviewStatus.Pending),
				pageable).map(roomMapper::getRoomDTOFrom);
	}
	
	
	public Page<InterviewScheduleSummaryDTO> findActiveInterviewScheduleForRoom(int roomId, Pageable pageable){
		return interviewScheduleRepository.findByRoom_IdAndStatusInOrderByStartTimeAsc(
				roomId,
				List.of(InterviewStatus.InProcess, InterviewStatus.Pending),
				pageable).map(interviewScheduleMapper::findInterviewScheduleSummaryFrom);
	}
	
	public Page<InterviewScheduleSummaryDTO> findPastInterviewScheduleForRoom(int roomId, Pageable pageable){
		return interviewScheduleRepository.findByRoom_IdAndStatusInOrderByStartTimeAsc(
				roomId,
				List.of(InterviewStatus.Completed),
				pageable).map(interviewScheduleMapper::findInterviewScheduleSummaryFrom);
	}
	
	
	public Page<InterviewScheduleSummaryDTO> findActiveInterviewScheduleForStudent(int studentId, Pageable pageable){
		return interviewScheduleRepository.findByStudent_IdAndStatusInOrderByStartTimeAsc(
				studentId,
				List.of(InterviewStatus.InProcess, InterviewStatus.Pending),
				pageable).map(interviewScheduleMapper::findInterviewScheduleSummaryFrom);
	}	
		
	public Page<InterviewScheduleSummaryDTO> findPastInterviewScheduleForStudent(int studentId, Pageable pageable){
		return interviewScheduleRepository.findByStudent_IdAndStatusInOrderByStartTimeAsc(
				studentId,
				List.of(InterviewStatus.Completed),
				pageable).map(interviewScheduleMapper::findInterviewScheduleSummaryFrom);
	}	
	
//	@Cacheable(value = "collegeInterviewSchedule", key = "T(com.placemate.security.utils.SecurityUtils).getCollegeId() + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
	public CollegeInterviewScheduleDTO findInterviewScheduleForCollege(Pageable pageable){
		int collegeId = SecurityUtils.getCollegeId();
	    	    Page<InterviewScheduleSummaryDTO> pageResult = interviewScheduleRepository
	            .findByInterviewRound_College_Id(collegeId, pageable)
	            .map(interviewScheduleMapper::findInterviewScheduleSummaryFrom);
	    
	    return CollegeInterviewScheduleDTO.builder()
	            .content(pageResult.getContent())
	            .pageNumber(pageResult.getNumber())
	            .pageSize(pageResult.getSize())
	            .totalElements(pageResult.getTotalElements())
	            .totalPages(pageResult.getTotalPages())
	            .build();
	}
	
}



