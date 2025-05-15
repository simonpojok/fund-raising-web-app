import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: false,
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // This endpoint would need to be implemented in the Django backend
    this.http.post(`${environment.apiUrl}/users/auth/reset-password-request/`, {
      email: this.forgotPasswordForm.value.email
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'If an account exists with this email, you will receive password reset instructions.';
        this.forgotPasswordForm.reset();
      },
      error: (error) => {
        console.error('Password reset request error:', error);
        this.isLoading = false;

        if (error.error?.email) {
          this.errorMessage = error.error.email[0];
        } else if (error.error?.non_field_errors) {
          this.errorMessage = error.error.non_field_errors[0];
        } else {
          // Even if there's an error, we don't want to reveal if an email exists or not
          this.successMessage = 'If an account exists with this email, you will receive password reset instructions.';
          this.forgotPasswordForm.reset();
        }
      }
    });
  }

  // Getter for easy access to form fields
  get f() { return this.forgotPasswordForm.controls; }
}
