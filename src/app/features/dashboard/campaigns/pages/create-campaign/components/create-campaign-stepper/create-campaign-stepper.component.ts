import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

export interface StepperStep {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-create-campaign-stepper',
  templateUrl: './create-campaign-stepper.component.html',
  standalone: false,
})
export class CreateCampaignStepperComponent {
  @Input() steps: StepperStep[] = [];
  @Input() currentStep: number = 1;
  @Input() canNavigateToStep!: (step: number) => boolean;

  @Output() stepChange = new EventEmitter<number>();

  // Add the missing properties that the template expects
  totalSteps: number = 4; // Default to 4 steps
  isSaving: boolean = false; // Default state

  ngOnInit(): void {
    // Set total steps based on the steps array length
    this.totalSteps = this.steps.length;
  }

  onStepClick(step: number): void {
    if (this.canNavigateToStep(step)) {
      this.stepChange.emit(step);
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

  getStepClasses(step: StepperStep): string {
    const status = this.getStepStatus(step);
    const baseClasses = 'relative flex items-center transition-all duration-200';

    switch (status) {
      case 'completed':
        return `${baseClasses} cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20`;
      case 'current':
        return `${baseClasses} bg-primary-50 dark:bg-primary-900/50`;
      case 'upcoming':
        return `${baseClasses} cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800`;
      case 'disabled':
        return `${baseClasses} cursor-not-allowed opacity-60`;
      default:
        return baseClasses;
    }
  }

  getStepConnectorClasses(stepIndex: number): string {
    const isLastStep = stepIndex === this.steps.length - 1;
    const nextStep = this.steps[stepIndex + 1];

    if (isLastStep) return 'hidden';

    const nextStepStatus = nextStep ? this.getStepStatus(nextStep) : 'disabled';
    const currentStepStatus = this.getStepStatus(this.steps[stepIndex]);

    if (currentStepStatus === 'completed' && (nextStepStatus === 'completed' || nextStepStatus === 'current')) {
      return 'absolute top-4 left-4 -ml-px h-full w-0.5 bg-primary-600';
    } else {
      return 'absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-300 dark:bg-gray-600';
    }
  }

  getStepNumberClasses(step: StepperStep): string {
    const status = this.getStepStatus(step);
    const baseClasses = 'relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium';

    switch (status) {
      case 'completed':
        return `${baseClasses} bg-primary-600 text-white`;
      case 'current':
        return `${baseClasses} bg-primary-600 text-white border-2 border-primary-200 dark:border-primary-400`;
      case 'upcoming':
        return `${baseClasses} bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300`;
      case 'disabled':
        return `${baseClasses} bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500`;
      default:
        return baseClasses;
    }
  }

  // Add the missing methods that the template expects
  getCompletionPercentage(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }

  // Methods that are expected by the template but should be handled by parent
  cancel(): void {
    // This should be handled by the parent component
    console.warn('Cancel method called on stepper - should be handled by parent');
  }

  saveDraft(): void {
    // This should be handled by the parent component
    console.warn('SaveDraft method called on stepper - should be handled by parent');
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

  createCampaign(): void {
    // This should be handled by the parent component
    console.warn('CreateCampaign method called on stepper - should be handled by parent');
  }

  isCurrentStepValid(): boolean {
    // This should be determined by the parent component
    return true;
  }

  isFormValid(): boolean {
    // This should be determined by the parent component
    return true;
  }

  prepareCampaignData(): any {
    // This should be handled by the parent component
    return {};
  }
}
