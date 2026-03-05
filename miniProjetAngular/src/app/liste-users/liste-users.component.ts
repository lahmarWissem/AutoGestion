import { Router } from '@angular/router';
import { Role } from './../models/role.model';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';

@Component({
  selector: 'app-liste-users',
  templateUrl: './liste-users.component.html',
  styleUrls: ['./liste-users.component.css']
})
export class ListeUsersComponent implements OnInit {
  roles? :Role[];
  users!: User[];
  image: any;
  listImages: String[] = [];
  roless? = new Role();
  numberOfusers : number = 0 ;
  IdRole! : number;

  constructor(public authService :AuthService,private router:Router) { }

  ngOnInit(): void {

    this.chargerusers();

}
chargerusers() {
  this.authService.listeUsers().subscribe((voits) => {
   
    this.users = voits;
 
    this.numberOfusers = voits.length 
    for (let index = 0; index < this.users.length; index++) {
      if (this.users[index].image && this.users[index].image.idImage) {
        this.authService
          .loadImage(this.users[index].image.idImage)
          .subscribe({
            next: (res: any) => {
              this.listImages[index] =
                'data:' + res.type + ';base64,' + res.image;
            },
            error: (err: any) => {
              // Use default avatar when user has no photo
              this.listImages[index] = 'assets/undraw_profile_pic_ic-5-t.svg';
            }
          });
      } else {
        // Use default avatar when user has no image
        this.listImages[index] = 'assets/undraw_profile_pic_ic-5-t.svg';
      }
    }

});

}

deleteUser (id: number) {
  if (confirm('Sure!')) {
    this.authService.deleteUser(id).subscribe(() => {
      this.router.navigate(['/home/listeusers']).then(() => {
        window.location.reload()
      })
    })
  }
}
}
      
   

  


