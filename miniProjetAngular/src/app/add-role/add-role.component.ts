import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../models/role.model';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html',
    styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
    newRole = new Role();
    message: string = '';
    err: number = 0;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit(): void { }

    addRole() {
        this.authService.addRole(this.newRole).subscribe({
            next: () => {
                this.router.navigate(['/home/listroles']);
            },
            error: (err: any) => {
                if (err.error && err.error.error) {
                    this.message = err.error.error;
                } else {
                    this.message = 'Erreur lors de la création du rôle.';
                }
                this.err = 1;
            }
        });
    }
}
