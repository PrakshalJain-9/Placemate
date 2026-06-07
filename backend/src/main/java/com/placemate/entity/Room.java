package com.placemate.entity;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity
@Table(name = "Room", uniqueConstraints = {@UniqueConstraint(columnNames = {"room_name", "college_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
public class Room {
	
	@Id
	@Column(name = "room_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@ToString.Include
	private int id;
	
	@Column(name = "room_name", nullable = false)
	@ToString.Include
	private String roomName;
	
	@Column(name = "capacity", nullable = false)
	@ToString.Include
	private int capacity;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "college_id")
	@Nonnull
	private College college;
	
	
	@Version
	private Long version;

}
