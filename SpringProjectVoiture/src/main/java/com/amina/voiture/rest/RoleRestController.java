package com.amina.voiture.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.amina.voiture.entities.Role;
import com.amina.voiture.entities.User;
import com.amina.voiture.repos.RoleRepository;
import com.amina.voiture.repos.UserRepository;


@RestController
@RequestMapping("/users/api/rol")
public class RoleRestController {

	@Autowired
	RoleRepository rolerep;

	@Autowired
	UserRepository userRep;

	@RequestMapping(method = RequestMethod.GET)
	public List<Role> getAllRoles() {
		return rolerep.findAll();
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Role getRoleById(@PathVariable("id") Long id) {
		return rolerep.findById(id).get();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<?> addRole(@RequestBody Role role) {
		Role existing = rolerep.findByRole(role.getRole());
		if (existing != null) {
			Map<String, String> error = new HashMap<>();
			error.put("error", "Ce rôle existe déjà.");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
		Role saved = rolerep.save(role);
		return ResponseEntity.ok(saved);
	}

	@RequestMapping(method = RequestMethod.PUT)
	public ResponseEntity<?> updateRole(@RequestBody Role role) {
		Role existing = rolerep.findByRole(role.getRole());
		if (existing != null && !existing.getRole_id().equals(role.getRole_id())) {
			Map<String, String> error = new HashMap<>();
			error.put("error", "Un autre rôle avec ce nom existe déjà.");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
		Role saved = rolerep.save(role);
		return ResponseEntity.ok(saved);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteRole(@PathVariable("id") Long id) {
		// Check if any users are assigned to this role
		List<User> allUsers = userRep.findAll();
		for (User u : allUsers) {
			if (u.getRoles() != null) {
				for (Role r : u.getRoles()) {
					if (r.getRole_id().equals(id)) {
						Map<String, String> error = new HashMap<>();
						error.put("error", "Impossible de supprimer ce rôle car il est attribué à des utilisateurs.");
						return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
					}
				}
			}
		}
		rolerep.deleteById(id);
		return ResponseEntity.ok().build();
	}
}
