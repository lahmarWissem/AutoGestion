package com.amina.voiture.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amina.voiture.entities.Role;
import com.amina.voiture.repos.RoleRepository;
import com.amina.voiture.services.RoleService;

@Service
public class RoleServiceImpl implements RoleService {
	 @Autowired
	    private RoleRepository roleRepository;

	    @Override
	    public List <Role> findAll() {
	        return roleRepository.findAll();
	    }

		@Override
		public Role saveRole(Role r) {
			return roleRepository.save(r);
		}

		@Override
		public Role updateRole(Role c) {
			return roleRepository.save(c);
		}


		@Override
		public Role getRole(Long idRole) {
			return roleRepository.findById(idRole).get();
		}
}
