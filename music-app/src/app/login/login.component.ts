import { Component } from '@angular/core';
import { SlideshowLoginImageComponent } from "../slideshow-login-image/slideshow-login-image.component";
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators , ReactiveFormsModule} from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SlideshowLoginImageComponent, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }


  login(): void {
    if(this.loginForm.valid) {
      const {username, password} = this.loginForm.value;
      console.log("Kredencialet: ", {username, password});
      this.authService.loginUser(username, password).subscribe(
        response => {
          console.log('Login User Succesful', response);
          this.router.navigate(['/youtube']);
          this.authService.saveToken(response.token)

        },error => {
          console.error('Login Failed', error)
        }
      )

    }
  }

}

