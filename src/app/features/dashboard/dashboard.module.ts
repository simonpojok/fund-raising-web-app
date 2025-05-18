import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { authGuard } from '../../core/guards/auth.guard';
import {CreateCampaignComponent} from './pages/create-campaign/create-campaign.component';
import {CreateCampaignStepperComponent} from './components/create-campaign-stepper/create-campaign-stepper.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'profile', component: UserProfileComponent }
    ]
  }
];

@NgModule({
  declarations: [
    DashboardLayoutComponent,
    DashboardHomeComponent,
    SidebarComponent,
    UserProfileComponent,
    HeaderComponent,
    CreateCampaignComponent,
    CreateCampaignStepperComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class DashboardModule { }
