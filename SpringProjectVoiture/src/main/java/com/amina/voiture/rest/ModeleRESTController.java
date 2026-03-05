package com.amina.voiture.rest;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.amina.voiture.entities.Modele;
import com.amina.voiture.repos.*;

@RestController
@RequestMapping("/voitures/mod")
public class ModeleRESTController {
	@Autowired
	ModeleRepository modeleRepository;

	@RequestMapping(method = RequestMethod.GET)
	public List<Modele> getAllModeles() {
		return modeleRepository.findAll();
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Modele getModeleById(@PathVariable("id") Long id) {
		return modeleRepository.findById(id).get();
	}

	@RequestMapping(method = RequestMethod.POST)
	public Modele createModele(@RequestBody Modele modele) {
		return modeleRepository.save(modele);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteModele(@PathVariable("id") Long id) {
		modeleRepository.deleteById(id);
	}
}