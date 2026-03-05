package com.amina.voiture.serviceImpl;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amina.voiture.entities.Role;
import com.amina.voiture.entities.User;
import com.amina.voiture.repos.RoleRepository;
import com.amina.voiture.repos.UserRepository;
import com.amina.voiture.services.UserService;

@Transactional
@Service
public class UserServiceImpl  implements UserService{

	@Autowired
	UserRepository userRep;
	
	@Autowired
	RoleRepository roleRep;
	
	
	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@Override
	public User saveUser(User user) {
		
		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		return userRep.save(user);
	}

	@Override
	public User addRoleToUser(String username, String rolename) {
		User usr = userRep.findByUsername(username);
		Role r = roleRep.findByRole(rolename);
		
		if (usr.getRoles() == null) {
			usr.setRoles(new java.util.ArrayList<>());
		}
		usr.getRoles().add(r);
		return usr;
	}

	
	@Override
	public Role addRole(Role role) {
		return roleRep.save(role);
	}

	@Override
	public User findUserByUsername(String username) {	
		return userRep.findByUsername(username);
	}
	@Override
    public List <User> findAll() {
        return userRep.findAll();
    }

	@Override
	public User updateUser(User u) {
		return userRep.save(u);
	}

	@Override
	public void deleteUser(User u) {
		userRep.delete(u);
	}

	@Override
	public void deleteUserById(Long idUser) {
		User user = userRep.findById(idUser).orElse(null);
		if (user != null) {
			// Clear roles to avoid cascade delete issues
			user.setRoles(null);
			userRep.save(user);
			// Now delete the user
			userRep.deleteById(idUser);
		}
	}

	@Override
	public User getUser(Long idUser) {
		return userRep.findById(idUser).get();
	}

	

}
