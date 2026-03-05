import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  err: number = 0;
  submitted: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onLoggedin() {
    this.submitted = true;
    this.err = 0;

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    const user = new User();
    user.username = this.loginForm.value.username;
    user.password = this.loginForm.value.password;

    this.authService.login(user).subscribe({
      next: (data) => {
        let jwToken = data.headers.get('Authorization')!;
        this.authService.saveToken(jwToken);
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.err = 1;
        console.log(this.err);
      },
    });
  }

  fillDemo(username: string, password: string) {
    this.loginForm.patchValue({ username, password });
  }
}
