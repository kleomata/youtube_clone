import { Component } from '@angular/core';
import { SlideshowLoginImageComponent } from '../slideshow-login-image/slideshow-login-image.component';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, State, City } from 'country-state-city'
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SlideshowLoginImageComponent, NgClass, NgIf, NgFor, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent{


  currentStep: number = 1
  register: FormGroup;
  isSubmitted: boolean = false;

  showSuccessMessage: boolean = false;
  generatedUserId: string = '';



  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];


  constructor(private fb: FormBuilder, 
    private authService: AuthService
  ) {
    this.register = this.fb.group({
      // Step 1
      firstName: ['', [Validators.required, this.nameValidator]],
      lastName: ['', [Validators.required, this.nameValidator]],
      birthdate: ['', [Validators.required, this.birthdateValidator]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      phone: ['', [Validators.required, this.phoneValidator]],

      // Step 2
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: [{ value: ''}, Validators.required],
      specificAddress: ['', [Validators.required]],

      // Step 3
      picture: [null, Validators.required],
      picturePreview: [''],

      // Step 4
      username: ['', [Validators.required, this.usernameValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
     this.countries = Country.getAllCountries();

    this.register.get('country')?.valueChanges.subscribe(value => this.onCountryChange(value));
    this.register.get('state')?.valueChanges.subscribe(value => this.onStateChange(value));
  }

  private passwordMatchValidator(formGroup: FormGroup): void {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  private nameValidator(control: any) {
    const value = control.value;
    const regex = /^[A-Z][a-z]*$/;
    if (value && !regex.test(value)) {
      return { invalidName: true };
    }
    return null;
  }

  private birthdateValidator(control: any) {
    const value = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - value.getFullYear();
    if (age < 18 || isNaN(value.getTime())) {
      return { invalidBirthdate: true };
    }
    return null;
  }

  private emailValidator(control: any) {
    const value = control.value;
    const regex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.com$/;
    if (value && !regex.test(value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  private phoneValidator(control: any) {
    const value = control.value;
    const regex = /^\+\d{1,15}$/;
    if (value && !regex.test(value)) {
      return { invalidPhone: true };
    }
    return null;
  }

  private usernameValidator(control: any) {
    const value = control.value;
    const regex = /^[A-Z][A-Za-z0-9]{4,14}$/;
    if (value && !regex.test(value)) {
      return { invalidUsername: true };
    }
    return null;
  }

  onCountryChange(countryCode: string): void {
    if (countryCode) {
      this.states = State.getStatesOfCountry(countryCode);
      this.cities = [];
      this.register.get('state')?.setValue('');
      this.register.get('state')?.setValue('');
    }
  }

  onStateChange(stateCode: string): void {
    const country = this.register.get('country')?.value;
    if (country && stateCode) {
      this.cities = City.getCitiesOfState(country, stateCode);
      this.register.get('city')?.setValue('');
    }
  }


  isStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.isFormValid(['firstName', 'lastName', 'birthdate', 'gender', 'email', 'phone']);
      case 2:
        return this.isFormValid(['country', 'state', 'city', 'specificAddress']);
      case 3:
        return this.isPictureSelected();
      case 4:
        return this.isFormValid(['username', 'password', 'confirmPassword']);
      default:
        return false; 
    }
  } 

  private isFormValid(fields: string[]): boolean {
    return fields.every(field => this.register.get(field)?.valid);
  }

  nextStep(): void {
    this.isSubmitted = true;

    if (this.isStepValid()) {
      if(this.currentStep < 4) {
        this.currentStep++;
        this.isSubmitted = false
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.isSubmitted = false; // Reset isSubmitted when going back
    }
  }

  selectedFile: File | null = null
  imagesPreviews: string | null = null;

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    if(file) {
      this.selectedFile = file;
      this.register.patchValue({picture: file})
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagesPreviews = e.target.result
      };
      reader.readAsDataURL(file)
    }
  }
  removeImage() {
    this.imagesPreviews = null;
    this.selectedFile = null;
    this.register.patchValue({picture: null})
  } 
  public isPictureSelected(): boolean {
    return !!this.selectedFile;
  }


  submitForm(): void {
    this.isSubmitted = true;

    const registerUser: any = {
      ...this.register.value
    }


    if(this.selectedFile) {
      this.authService.registerUser(registerUser, this.selectedFile).subscribe({
        next: (response) => {
          console.log("User added successfully!", response);
          console.log(registerUser)
          //this.register.reset();
          //this.currentStep = 1;
        },
        error: (error) => {
          console.error("Error adding user: ", error);
        }
      })
    } else {
      console.error("No picture selected.");
    }

    
  }

  resetAndRegisterNewUser(): void {
    this.showSuccessMessage = false;
    this.resetForm();
    this.currentStep = 1;
    this.isSubmitted = false;
  }


  private resetForm(): void {
    this.register.reset();
    //this.showSuccessMessage = false;
  }

  isStepCompleted(step: number): boolean {
    return this.currentStep > step;
  }

  isStepCurrent(step: number): boolean {
    return this.currentStep === step;
  }
}

