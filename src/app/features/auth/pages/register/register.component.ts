import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  fieldErrors: { [key: string]: string[] } = {};

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      display_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.pattern('^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$')],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],
      termsAgreement: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirm_password')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Mark all fields as touched to trigger validation
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.fieldErrors = {};

    const registrationData = { ...this.registerForm.value };
    delete registrationData.termsAgreement; // Remove terms agreement as it's not needed in API

    this.authService.register(registrationData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.isLoading = false;

        if (error.error) {
          // Handle field-specific errors
          if (typeof error.error === 'object') {
            this.fieldErrors = error.error;

            // Set the first error as general error message
            const firstErrorField = Object.keys(error.error)[0];
            if (firstErrorField && error.error[firstErrorField][0]) {
              this.errorMessage = `${this.getFieldLabel(firstErrorField)}: ${error.error[firstErrorField][0]}`;
            } else {
              this.errorMessage = 'Please correct the errors in the form.';
            }
          } else {
            this.errorMessage = 'An error occurred during registration. Please try again.';
          }
        } else {
          this.errorMessage = 'Network error. Please check your connection and try again.';
        }
      }
    });
  }

  private getFieldLabel(fieldName: string): string {
    const fieldLabels: {[key: string]: string} = {
      'display_name': 'Name',
      'email': 'Email',
      'phone_number': 'Phone',
      'password': 'Password',
      'confirm_password': 'Confirm Password',
      'non_field_errors': 'Error'
    };

    return fieldLabels[fieldName] || fieldName;
  }

  // Getter for easy access to form fields
  get f() { return this.registerForm.controls; }
}
