import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signupForm!: FormGroup;
  formSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, this.optionalNameValidator()]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator()]]
    });
  }

  // Custom validator function for optional name validation
  optionalNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // Skip validation if the value is empty
      }
      const valid = /^[a-zA-Z]+$/.test(value);
      return valid ? null : { invalidName: true };
    };
  }

  // Custom validator function for password
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // Return if the control is empty
      }

      // Check if the password has at least 6 characters and contains at least one special character
      const hasSixCharacters = value.length >= 6;
      const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const passwordValid = hasSixCharacters && hasSpecialCharacter;

      return !passwordValid ? { passwordStrength: true } : null;
    };
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.signupForm.valid) {
      this.loginService.signup(this.signupForm.value)
        .subscribe(
          response => {
            console.log('Registration successful!', response);
            this.router.navigate(['/login']);
          },
          error => {
            console.error('Error occurred:', error);
            this.snackBar.open('Registration failed. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
        );
    } else {
      this.snackBar.open('Please fill out the form correctly.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }
}
