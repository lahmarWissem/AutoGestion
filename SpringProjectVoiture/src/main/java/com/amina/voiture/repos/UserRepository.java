package com.amina.voiture.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.amina.voiture.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

		User findByUsername(String username);
		

}
