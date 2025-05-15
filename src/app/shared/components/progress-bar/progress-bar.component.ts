import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  standalone: true,
  imports: [NgIf]
})
export class ProgressBarComponent implements OnChanges {
  @Input() progress: number = 0; // 0 to 100
  @Input() height: string = 'h-2';
  @Input() showPercentage: boolean = false;
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() animate: boolean = true;
  @Input() rounded: boolean = true;

  displayProgress: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['progress']) {
      // Ensure progress is between 0 and 100
      this.displayProgress = Math.min(Math.max(0, this.progress), 100);
    }
  }

  get progressBarClasses(): string {
    const baseClasses = `${this.height} ${this.rounded ? 'rounded-full' : ''} transition-all duration-300`;

    const colorClasses = {
      primary: 'bg-primary-600 dark:bg-primary-500',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-danger'
    };

    const animationClasses = this.animate ? 'animate-pulse' : '';

    return `${baseClasses} ${colorClasses[this.color]} ${animationClasses}`;
  }

  get containerClasses(): string {
    return `w-full bg-gray-200 dark:bg-gray-700 ${this.rounded ? 'rounded-full' : ''} overflow-hidden`;
  }
}
