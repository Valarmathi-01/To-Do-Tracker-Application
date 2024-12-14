import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  formSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.gmailValidator()]],
      password: ['', [Validators.required, this.passwordValidator()]]
    });
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

  // Custom validator function to check if the email ends with '@gmail.com'
  gmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // Return if the control is empty
      }

      const endsWithGmail = value.endsWith('@gmail.com');

      return !endsWithGmail ? { gmailDomain: true } : null;
    };
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.loginService.login({ email, password }).subscribe(
        response => {
          console.log('Login successful:', response);
          localStorage.setItem('userEmailId', email);
          this.router.navigate(['/list-add']);
        },
        error => {
          console.error('Login error:', error);
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', {
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
