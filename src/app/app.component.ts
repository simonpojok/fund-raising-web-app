import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Initialize theme based on stored preference or system preference
    const storedTheme = localStorage.getItem('theme_mode');
    if (storedTheme) {
      this.themeService.setTheme(storedTheme as 'light' | 'dark' | 'system');
    }
  }
}
