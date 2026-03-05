package com.amina.voiture.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.amina.voiture.entities.Role;

@RepositoryRestResource(path = "rol")
public interface RoleRepository extends JpaRepository<Role, Long> {

	Role findByRole(String role);
	
	
	
}
