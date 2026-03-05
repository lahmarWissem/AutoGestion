package com.amina.voiture.services;


import java.util.List;

import com.amina.voiture.entities.Role;

public interface RoleService {
	
	 List <Role> findAll();  
	 Role saveRole(Role r);
	 Role updateRole(Role r);
	 Role getRole (Long idRole);

}
