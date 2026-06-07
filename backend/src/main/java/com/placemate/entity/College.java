package com.placemate.entity;

import java.util.ArrayList;
import java.util.List;

import com.placemate.helpers.Address;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "college")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class College {
	
	@Column(name = "college_id")
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "college_name")
	private String collegeName;
	
	@Embedded
	private Address address;
	
	@OneToMany(mappedBy = "college", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Room> roomList = new ArrayList<>();
	
	@OneToMany(mappedBy = "college", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Student> studentList = new ArrayList<>();
	
	
	public void addRoom(Room room) {
		roomList.add(room);
		room.setCollege(this);
	}
	

	public void addStudent(Student student) {
		studentList.add(student);
		student.setCollege(this);
	}
	
	
	public void deleteStudent(Student student) {
		studentList.remove(student);
		student.setCollege(null);
	}
	
	
	public void deleteRoom(Room room) {
		roomList.remove(room);
		room.setCollege(null);
	}
}












