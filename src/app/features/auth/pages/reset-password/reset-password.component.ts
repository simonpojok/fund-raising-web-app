import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: false,
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  token: string | null = null;
  uid: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get token and uid from URL params
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.uid = params['uid'];

      if (!this.token || !this.uid) {
        this.errorMessage = 'Invalid password reset link. Please request a new one.';
      }
    });

    this.resetPasswordForm = this.formBuilder.group({
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('new_password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirm_password')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid || !this.token || !this.uid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // This endpoint would need to be implemented in the Django backend
    this.http.post(`${environment.apiUrl}/users/auth/reset-password-confirm/`, {
      token: this.token,
      uid: this.uid,
      new_password: this.resetPasswordForm.value.new_password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Your password has been reset successfully. You can now login with your new password.';

        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('Password reset confirmation error:', error);
        this.isLoading = false;

        if (error.error?.token) {
          this.errorMessage = 'Invalid or expired reset token. Please request a new reset link.';
        } else if (error.error?.new_password) {
          this.errorMessage = error.error.new_password[0];
        } else if (error.error?.non_field_errors) {
          this.errorMessage = error.error.non_field_errors[0];
        } else {
          this.errorMessage = 'An error occurred while resetting your password. Please try again.';
        }
      }
    });
  }

  // Getter for easy access to form fields
  get f() { return this.resetPasswordForm.controls; }
}
