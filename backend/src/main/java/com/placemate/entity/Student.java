package com.placemate.entity;

import com.placemate.entity.enums.StudentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "student")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
@Builder
public class Student {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@ToString.Include
	private int id;
	
	@Column(name = "student_name")
	@ToString.Include
	private String name;
	
	@Column(name = "rollNumber", unique = true, nullable = false)
	@ToString.Include
	private String rollNumber;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "college_id")
	private College college;
	
	@Column(name = "emailId", unique = true, nullable = false)
	@ToString.Include
	private String emailId;
	
	@Column(name = "password")
	@ToString.Include
	private String password;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private StudentStatus status;
	
	@Column(name = "role")
	@ToString.Include
	private String role;
}
