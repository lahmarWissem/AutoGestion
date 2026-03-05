import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { ImageUser } from '../models/imageUser.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  err: number = 0;
  success: boolean = false;
  uploadedImage!: File;
  submitted: boolean = false;

  availableRoles: Role[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });

    this.fetchRoles();
  }

  fetchRoles() {
    this.authService.listeRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      }
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    this.err = 0;

    // Validate file size (max 5MB)
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      this.err = 2;
      this.uploadedImage = null!;
      event.target.value = ''; // Clear the file input
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      this.err = 3;
      this.uploadedImage = null!;
      event.target.value = ''; // Clear the file input
      return;
    }

    // Optional: Validate file name has extension
    if (!file.name || !file.name.includes('.')) {
      this.err = 4;
      this.uploadedImage = null!;
      event.target.value = ''; // Clear the file input
      return;
    }

    // All validations passed
    this.uploadedImage = file;
  }

  onRegister() {
    this.submitted = true;
    this.err = 0;

    // Stop if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const user = new User();
    user.username = this.registerForm.value.username;
    user.password = this.registerForm.value.password;

    // Add selected user role
    const selectedRoleName = this.registerForm.value.role;
    const selectedRole = this.availableRoles.find(r => r.role === selectedRoleName);

    if (selectedRole) {
      user.roles = [selectedRole];
    } else {
      // Fallback if role is not found in array for some reason
      const fallbackRole = new Role();
      fallbackRole.role = selectedRoleName;
      user.roles = [fallbackRole];
    }

    user.enabled = true;

    if (this.uploadedImage) {
      this.authService
        .uploadImageUser(this.uploadedImage, this.uploadedImage.name)
        .subscribe({
          next: (response: any) => {
            this.authService
              .loadImageUserById(response.idImage)
              .subscribe({
                next: (image: any) => {
                  let img = new ImageUser();
                  img.idImage = image.idImage;
                  img.name = image.name;
                  img.type = image.type;
                  img.image = image.image;
                  user.image = img;

                  this.submitUserRegistration(user);
                },
                error: (err: any) => {
                  console.error('Error loading image:', err);
                  this.submitUserRegistration(user);
                }
              });
          },
          error: (err: any) => {
            console.error('Error uploading image:', err);
            this.err = 1;
            this.success = false;
          }
        });
    } else {
      this.submitUserRegistration(user);
    }
  }

  private submitUserRegistration(user: User) {
    this.authService.registerUser(user).subscribe({
      next: (data: any) => {
        this.success = true;
        this.err = 0;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        if (err.status === 400 && err.error && err.error.error) {
          this.err = 5;
        } else {
          this.err = 1;
        }
        this.success = false;
        console.log(err);
      },
    });
  }
}

