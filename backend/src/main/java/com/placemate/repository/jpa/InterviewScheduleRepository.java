package com.placemate.repository.jpa;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.placemate.entity.InterviewSchedule;
import com.placemate.entity.Room;
import com.placemate.entity.enums.InterviewStatus;

@Repository
public interface InterviewScheduleRepository extends JpaRepository<InterviewSchedule, Integer>{
	Page<InterviewSchedule> findByInterviewRound_College_Id(int collegeId, Pageable pageable);
	Optional<InterviewSchedule> findById(int scheduleId);
	List<InterviewSchedule> findByStudent_Id(int studentId);

	boolean existsByStartTimeAndRoom_Id(LocalDateTime startTime, int roomId);
	boolean existsByStartTimeAndStudent_Id(LocalDateTime startTime, int studentId);
	boolean existsByIdAndInterviewRound_College_Id(int scheduleId, int collegeId);
	
	@Query("SELECT s.room " +
	           "FROM InterviewSchedule s " +
	           "WHERE s.interviewRound.college.id = :collegeId " +
	           "AND s.status IN :activeStatuses " +
	           "GROUP BY s.room " +
	           "ORDER BY MIN(s.startTime) ASC")
	    Page<Room> findActiveRoomsSortedByNextSchedule(
	    		@Param("collegeId") int collegeId, 
	    		@Param("activeStatuses") List<InterviewStatus> activeStatuses,
	            Pageable pageable);
	
	
	Page<InterviewSchedule> findByRoom_IdAndStatusInOrderByStartTimeAsc(
	        int roomId, 
	        List<InterviewStatus> statuses, 
	        Pageable pageable
	);
	
	
	Page<InterviewSchedule> findByStudent_IdAndStatusInOrderByStartTimeAsc(
            int studentId, 
            List<InterviewStatus> statuses, 
            Pageable pageable
    );
	
	@Query("SELECT s FROM InterviewSchedule s " +
	           "JOIN s.student st " +
	           "JOIN s.interviewRound r " +
	           "JOIN r.company c " +
	           "WHERE r.college.id = :collegeId " + 
	           "AND (" +
	               "LOWER(st.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
	               "OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :query, '%')) " +
	           ") " +
	           "ORDER BY s.startTime ASC")
	    Page<InterviewSchedule> searchSchedulesGlobally(
	            @Param("query") String query, 
	            @Param("collegeId") int collegeId, 
	            Pageable pageable
	    );
}



