import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../models/role.model';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-list-roles',
    templateUrl: './list-roles.component.html',
    styleUrls: ['./list-roles.component.css']
})
export class ListRolesComponent implements OnInit {
    roles: Role[] = [];
    numberOfRoles: number = 0;
    message: string = '';
    err: number = 0;

    constructor(public authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.loadRoles();
    }

    loadRoles() {
        this.authService.listeRoles().subscribe((roles) => {
            this.roles = roles;
            this.numberOfRoles = roles.length;
        });
    }

    deleteRole(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
            this.authService.deleteRole(id).subscribe({
                next: () => {
                    this.loadRoles();
                    this.err = 0;
                },
                error: (err: any) => {
                    if (err.error && err.error.error) {
                        this.message = err.error.error;
                    } else {
                        this.message = 'Erreur lors de la suppression du rôle.';
                    }
                    this.err = 1;
                }
            });
        }
    }
}
