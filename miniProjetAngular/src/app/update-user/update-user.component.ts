import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { ImageUser } from '../models/imageUser.model';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  roles!: Role[];
  newUser = new User();
  newIdRole!: number;
  newRole = new Role();
  users!: User[];
  role!: String;
  uploadedImage!: File;
  image: any;
  response: any;
  user = new User();
  userRole = new Role();

  err: number = 0;
  message: string = '';

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute,) { }

  updateUser() {
    // Find the complete role object from the roles list
    const selectedRole = this.roles.find(r => r.role === this.role);
    if (selectedRole && selectedRole.role_id) {
      // Use the complete role object with role_id
      this.user.roles = [selectedRole];
      console.log('Selected role with ID:', selectedRole);
    } else {
      console.error('Role not found or missing role_id');
      this.message = 'Erreur: Rôle invalide';
      this.err = 1;
      return;
    }

    if (this.uploadedImage) {
      this.authService
        .uploadImageUser(this.uploadedImage, this.uploadedImage.name)
        .subscribe({
          next: (response: any) => {
            this.authService
              .loadImageUserById(response.idImage)
              .subscribe((image: any) => {
                let img = new ImageUser();
                img.idImage = image.idImage;
                img.name = image.name;
                img.type = image.type;
                img.image = image.image;
                this.user.image = img;

                this.authService.updateUser(this.user).subscribe({
                  next: (user) => {
                    this.router.navigate(['/home/listeusers']).then(() => {
                      window.location.reload();
                    });
                  },
                  error: (err: any) => {
                    console.error('Error updating user:', err);
                    if (err.error && err.error.message) {
                      this.message = err.error.message;
                    } else if (err.error && typeof err.error === 'string') {
                      this.message = err.error;
                    } else {
                      this.message = 'Erreur lors de la mise à jour de l\'utilisateur.';
                    }
                    this.err = 1;
                  }
                });
              });
          },
          error: (err: any) => {
            console.error('Error uploading image:', err);
            if (err.error && err.error.error) {
              this.message = err.error.error;
            } else {
              this.message = 'Erreur lors du téléchargement de l\'image.';
            }
            this.err = 1;
          }
        });
    } else {
      this.authService.updateUser(this.user).subscribe({
        next: (user) => {
          this.router.navigate(['/home/listeusers']).then(() => {
            window.location.reload();
          });
        },
        error: (err: any) => {
          console.error('Error updating user:', err);
          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else if (err.error && typeof err.error === 'string') {
            this.message = err.error;
          } else {
            this.message = 'Erreur lors de la mise à jour de l\'utilisateur.';
          }
          this.err = 1;
        }
      });
    }
  }

  ngOnInit(): void {
    this.authService.listeRoles().subscribe((mods) => {
      this.roles = mods;
    });

    this.authService.getUserById(this.activatedRoute.snapshot.params['id']).subscribe(user => {
      this.user = user;
      if (this.user.roles && this.user.roles.length > 0) {
        this.role = this.user.roles[0].role;
      }
    });
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    this.err = 0;
    this.message = '';

    // Validate file size (max 5MB)
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      this.err = 2;
      this.uploadedImage = null!;
      event.target.value = '';
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      this.err = 3;
      this.uploadedImage = null!;
      event.target.value = '';
      return;
    }

    // Validate file name has extension
    if (!file.name || !file.name.includes('.')) {
      this.err = 4;
      this.uploadedImage = null!;
      event.target.value = '';
      return;
    }

    // All validations passed
    this.uploadedImage = file;
  }
}
