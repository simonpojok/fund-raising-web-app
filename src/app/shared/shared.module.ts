import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

// Import all our standalone components
import {ThemeToggleComponent} from './components/theme-toggle/theme-toggle.component';
import {ButtonComponent} from './components/button/button.component';
import {InputComponent} from './components/input/input.component';
import {AlertComponent} from './components/alert/alert.component';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {ClickOutsideDirective} from './directives/click-outside.directive';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
import {CampaignCardComponent} from './components/campaign-card/campaign-card.component';
import {RecentActivitiesComponent} from './components/recent-activities/recent-activities.component';
import {CampaignCalendarComponent} from './components/campaign-calendar/campaign-calendar.component';
import {QuickActionsComponent} from './components/quick-actions/quick-actions.component';
import {TopContributorsComponent} from './components/top-contributors/top-contributors.component';
import {CampaignTabsComponent} from './components/campaign-tabs/campaign-tabs.component';
import {CampaignDetailComponent} from './components/campaign-detail/campaign-detail.component';

@NgModule({
  declarations: [
    ThemeToggleComponent,
    AlertComponent,
    ButtonComponent,
    SpinnerComponent,
    InputComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ClickOutsideDirective,
    ProgressBarComponent,
    CampaignCardComponent,
    RecentActivitiesComponent,
    CampaignCalendarComponent,
    QuickActionsComponent,
    TopContributorsComponent,
    CampaignTabsComponent,
    CampaignDetailComponent,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ThemeToggleComponent,
    InputComponent,
    AlertComponent,
    ClickOutsideDirective,
    ProgressBarComponent,
    CampaignCardComponent,
    RecentActivitiesComponent,
    CampaignCalendarComponent,
    QuickActionsComponent,
    TopContributorsComponent,
    CampaignTabsComponent,
    CampaignDetailComponent,
    ButtonComponent,
    SpinnerComponent,
  ]
})
export class SharedModule {
}
