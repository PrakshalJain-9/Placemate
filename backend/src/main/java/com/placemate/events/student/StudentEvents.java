package com.placemate.events.student;

import java.util.List;

import com.placemate.dto.StudentDTOs.StudentSummaryDTO;
import com.placemate.entity.College;
import com.placemate.entity.Student;

import lombok.Builder;
import lombok.With;
import lombok.extern.jackson.Jacksonized;

public class StudentEvents {
	
	@Builder
	@Jacksonized
	@With
	public record OnBoardinReminderRequestedEvent(List<Student> pendingStudents, String collegeName) {}
	
	@Builder
	@Jacksonized
	@With
	public record StudentCreatedEvent(StudentSummaryDTO studentSummaryDTO, College college) {}
}
