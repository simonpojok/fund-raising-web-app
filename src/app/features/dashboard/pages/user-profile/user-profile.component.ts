import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  standalone: false,
})
export class UserProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  isLoading = true;
  isUpdating = false;
  isUpdatingPassword = false;
  successMessage = '';
  errorMessage = '';
  passwordSuccessMessage = '';
  passwordErrorMessage = '';

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize forms
    this.initializeForms();

    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      if (user) {
        this.updateFormWithUserData(user);
      }

      this.isLoading = false;
    });

    // Fetch user profile if not available
    if (this.authService.isAuthenticated() && !this.currentUser) {
      this.authService.getUserProfile().subscribe({
        error: (error) => {
          console.error('Error loading user profile:', error);
          this.isLoading = false;
        }
      });
    }
  }

  initializeForms(): void {
    this.profileForm = this.formBuilder.group({
      display_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.pattern('^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$')],
      // Profile fields
      bio: [''],
      location: ['']
    });

    this.passwordForm = this.formBuilder.group({
      old_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  updateFormWithUserData(user: User): void {
    this.profileForm.patchValue({
      display_name: user.display_name,
      email: user.email,
      phone_number: user.phone_number || '',
      bio: user.profile?.bio || '',
      location: user.profile?.location || ''
    });

    // Disable email field as it should not be changed directly
    this.profileForm.get('email')?.disable();
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

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isUpdating = true;
    this.successMessage = '';
    this.errorMessage = '';

    const userData = {
      display_name: this.profileForm.value.display_name,
      phone_number: this.profileForm.value.phone_number
    };

    const profileData = {
      bio: this.profileForm.value.bio,
      location: this.profileForm.value.location
    };

    // These endpoints would need to be implemented in the Django backend
    // This is a simplified implementation for this example
    this.authService.updateUserProfile(userData, profileData).subscribe({
      next: (updatedUser) => {
        this.isUpdating = false;
        this.successMessage = 'Profile updated successfully.';

        // Clear message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.isUpdating = false;

        if (error.error) {
          // Handle field-specific errors
          if (typeof error.error === 'object') {
            const firstErrorField = Object.keys(error.error)[0];
            if (firstErrorField && error.error[firstErrorField][0]) {
              this.errorMessage = `${this.getFieldLabel(firstErrorField)}: ${error.error[firstErrorField][0]}`;
            } else {
              this.errorMessage = 'Please correct the errors in the form.';
            }
          } else {
            this.errorMessage = 'An error occurred while updating the profile. Please try again.';
          }
        } else {
          this.errorMessage = 'Network error. Please check your connection and try again.';
        }
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isUpdatingPassword = true;
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';

    const passwordData = {
      old_password: this.passwordForm.value.old_password,
      new_password: this.passwordForm.value.new_password
    };

    // This endpoint would need to be implemented in the AuthService
    // This is a simplified implementation for this example
    this.authService.changePassword(passwordData).subscribe({
      next: () => {
        this.isUpdatingPassword = false;
        this.passwordSuccessMessage = 'Password changed successfully.';
        this.passwordForm.reset();

        // Clear message after 3 seconds
        setTimeout(() => {
          this.passwordSuccessMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.isUpdatingPassword = false;

        if (error.error) {
          // Handle field-specific errors
          if (typeof error.error === 'object') {
            if (error.error.old_password) {
              this.passwordErrorMessage = `Current password: ${error.error.old_password[0]}`;
            } else if (error.error.new_password) {
              this.passwordErrorMessage = `New password: ${error.error.new_password[0]}`;
            } else if (error.error.non_field_errors) {
              this.passwordErrorMessage = error.error.non_field_errors[0];
            } else {
              this.passwordErrorMessage = 'Please correct the errors in the form.';
            }
          } else {
            this.passwordErrorMessage = 'An error occurred while changing the password. Please try again.';
          }
        } else {
          this.passwordErrorMessage = 'Network error. Please check your connection and try again.';
        }
      }
    });
  }

  private getFieldLabel(fieldName: string): string {
    const fieldLabels: {[key: string]: string} = {
      'display_name': 'Name',
      'email': 'Email',
      'phone_number': 'Phone',
      'bio': 'Bio',
      'location': 'Location',
      'old_password': 'Current password',
      'new_password': 'New password',
      'confirm_password': 'Confirm password',
      'non_field_errors': 'Error'
    };

    return fieldLabels[fieldName] || fieldName;
  }

  getUserInitials(): string {
    if (!this.currentUser?.display_name) {
      return '?';
    }

    const nameParts = this.currentUser.display_name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }

    return nameParts[0].substring(0, 2).toUpperCase();
  }
}
