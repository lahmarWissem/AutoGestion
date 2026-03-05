
import { UpdateUserComponent } from './update-user/update-user.component';
import { RechercheParNomComponent } from './recherche-par-nom/recherche-par-nom.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVoituresComponent } from './add-voitures/add-voitures.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './home/home.component';
import { ListModelesComponent } from './list-modeles/list-modeles.component';
import { ListVoituresComponent } from './list-voitures/list-voitures.component';
import { UpdateVoitureComponent } from './update-voiture/update-voiture.component';

import { ListeUsersComponent } from './liste-users/liste-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { VoitureGuard } from './voiture.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { UpdateRoleComponent } from './update-role/update-role.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'listVoiture', component: ListVoituresComponent },
      { path: 'addvoiture', component: AddVoituresComponent, canActivate: [VoitureGuard] },
      { path: 'updatevoiture/:id', component: UpdateVoitureComponent },
      { path: 'recherche', component: RechercheParNomComponent },
      { path: 'listmodeles', component: ListModelesComponent },
      { path: 'listeusers', component: ListeUsersComponent },
      { path: 'updateUser/:id', component: UpdateUserComponent },
      { path: 'app-forbidden', component: ForbiddenComponent },
      { path: 'formvalidation', component: ForbiddenComponent },
      { path: 'addUser', component: AddUserComponent },
      { path: 'drag-and-drop', component: DragAndDropComponent },
      { path: 'listroles', component: ListRolesComponent },
      { path: 'addRole', component: AddRoleComponent, canActivate: [VoitureGuard] },
      { path: 'updateRole/:id', component: UpdateRoleComponent },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
