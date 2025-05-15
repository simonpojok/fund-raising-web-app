import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  standalone: false,
})
export class DashboardLayoutComponent implements OnInit {
  isSidebarOpen = true;
  currentUser: User | null = null;
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Check if we need to load the user profile
    if (this.authService.isAuthenticated() && !this.currentUser) {
      this.loadUserProfile();
    }

    // Check for mobile view
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    if (window.innerWidth < 1024) {
      this.isSidebarOpen = false;
    }
  }

  private checkScreenSize(): void {
    this.isSidebarOpen = window.innerWidth >= 1024; // lg breakpoint
  }

  private loadUserProfile(): void {
    this.authService.getUserProfile().subscribe({
      error: (error) => {
        console.error('Error loading user profile:', error);
        // If unauthorized, redirect to login
        if (error.status === 401) {
          this.authService.logout();
        }
      }
    });
  }
}
