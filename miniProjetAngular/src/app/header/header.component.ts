import { AuthService } from './../services/auth.service';
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  ImageUser: any;
  showDropdown: boolean = false;

  constructor(public authService: AuthService, private eRef: ElementRef) { }

  ngOnInit(): void {
    this.loadUserImage();
  }

  loadUserImage() {
    this.authService.loadImageUser(this.authService.loggedUser).subscribe({
      next: (res: any) => {
        if (res.image) {
          this.ImageUser = 'data:' + res.type + ';base64,' + res.image;
        } else {
          // Triggered when auth.service.ts cleanly catches the 404 Photo Not Found
          this.ImageUser = 'assets/undraw_profile_pic_ic-5-t.svg';
        }
      },
      error: () => {
        this.ImageUser = 'assets/undraw_profile_pic_ic-5-t.svg';
      }
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onLogout() {
    this.showDropdown = false;
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}
