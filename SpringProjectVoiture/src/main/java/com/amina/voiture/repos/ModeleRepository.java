package com.amina.voiture.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.amina.voiture.entities.*;

@RepositoryRestResource(path = "mod")
public interface ModeleRepository extends JpaRepository<Modele, Long> {

}
