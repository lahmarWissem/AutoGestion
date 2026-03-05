import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../models/role.model';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-update-role',
    templateUrl: './update-role.component.html',
    styleUrls: ['./update-role.component.css']
})
export class UpdateRoleComponent implements OnInit {
    role = new Role();
    message: string = '';
    err: number = 0;

    constructor(
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            const id = params['id'];
            this.authService.listeRolesbyiduser(id).subscribe((r) => {
                this.role = r;
            });
        });
    }

    updateRole() {
        this.authService.updateRole(this.role).subscribe({
            next: () => {
                this.router.navigate(['/home/listroles']);
            },
            error: (err: any) => {
                if (err.error && err.error.error) {
                    this.message = err.error.error;
                } else {
                    this.message = 'Erreur lors de la mise à jour du rôle.';
                }
                this.err = 1;
            }
        });
    }
}
