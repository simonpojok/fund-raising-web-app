import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

export interface StepperStep {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-create-campaign-stepper',
  templateUrl: './create-campaign-stepper.component.html',
  styleUrls: ['./create-campaign-stepper.component.scss'],
  standalone: false,
})
export class CreateCampaignStepperComponent implements OnInit {
  @Input() steps: StepperStep[] = [];
  @Input() currentStep: number = 1;
  @Input() canNavigateToStep!: (step: number) => boolean;

  @Output() stepChange = new EventEmitter<number>();

  // Properties for template
  totalSteps: number = 4;
  isSaving: boolean = false;

  ngOnInit(): void {
    this.totalSteps = this.steps.length;
  }

  onStepClick(step: number): void {
    if (this.canNavigateToStep(step)) {
      this.stepChange.emit(step);
    }
  }

  onMobileStepChange(event: any): void {
    const stepNumber = parseInt(event.target.value);
    if (this.canNavigateToStep(stepNumber)) {
      this.stepChange.emit(stepNumber);
    }
  }

  getStepStatus(step: StepperStep): 'completed' | 'current' | 'upcoming' | 'disabled' {
    if (step.id < this.currentStep) {
      return 'completed';
    } else if (step.id === this.currentStep) {
      return 'current';
    } else if (this.canNavigateToStep(step.id)) {
      return 'upcoming';
    } else {
      return 'disabled';
    }
  }

  getStepCircleClasses(step: StepperStep): string {
    const status = this.getStepStatus(step);
    const baseClasses = 'relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 group-hover:scale-110';

    switch (status) {
      case 'completed':
        return `${baseClasses} bg-primary-600 dark:bg-primary-500 shadow-sm hover:bg-primary-700 dark:hover:bg-primary-400`;
      case 'current':
        return `${baseClasses} bg-primary-600 dark:bg-primary-500 shadow-lg ring-4 ring-primary-100 dark:ring-primary-900 animate-pulse`;
      case 'upcoming':
        return `${baseClasses} bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500`;
      case 'disabled':
        return `${baseClasses} bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed`;
      default:
        return baseClasses;
    }
  }

  getStepLabelClasses(step: StepperStep): string {
    const status = this.getStepStatus(step);

    switch (status) {
      case 'completed':
        return 'text-primary-600 dark:text-primary-400';
      case 'current':
        return 'text-primary-600 dark:text-primary-400 font-semibold';
      case 'upcoming':
        return 'text-gray-700 dark:text-gray-300';
      case 'disabled':
        return 'text-gray-400 dark:text-gray-600';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  }

  getProgressLineWidth(): number {
    if (this.steps.length <= 1) return 0;

    // Calculate progress as percentage between steps
    const completedSteps = this.currentStep - 1;
    const totalPossibleSteps = this.steps.length - 1;

    return (completedSteps / totalPossibleSteps) * 100;
  }

  // Mobile step indicator classes (if using alternative approach)
  getMobileStepClasses(step: StepperStep): string {
    const status = this.getStepStatus(step);
    const baseClasses = 'h-3 w-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200';

    switch (status) {
      case 'completed':
        return `${baseClasses} bg-primary-600 dark:bg-primary-500`;
      case 'current':
        return `${baseClasses} bg-primary-600 dark:bg-primary-500 ring-2 ring-primary-200 dark:ring-primary-800`;
      case 'upcoming':
        return `${baseClasses} bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500`;
      case 'disabled':
        return `${baseClasses} bg-gray-200 dark:bg-gray-700 cursor-not-allowed`;
      default:
        return baseClasses;
    }
  }

  // Methods expected by parent component
  getCompletionPercentage(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.stepChange.emit(this.currentStep - 1);
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.stepChange.emit(this.currentStep + 1);
    }
  }

  // Placeholder methods that should be handled by parent
  cancel(): void {
    console.warn('Cancel method should be handled by parent component');
  }

  saveDraft(): void {
    console.warn('SaveDraft method should be handled by parent component');
  }

  createCampaign(): void {
    console.warn('CreateCampaign method should be handled by parent component');
  }

  isCurrentStepValid(): boolean {
    return true;
  }

  isFormValid(): boolean {
    return true;
  }

  prepareCampaignData(): any {
    return {};
  }
}
