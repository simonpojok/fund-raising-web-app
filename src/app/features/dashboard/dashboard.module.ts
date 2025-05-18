import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {SharedModule} from '../../shared/shared.module';
import {DashboardLayoutComponent} from './components/dashboard-layout/dashboard-layout.component';
import {DashboardHomeComponent} from './pages/dashboard-home/dashboard-home.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {HeaderComponent} from './components/header/header.component';
import {UserProfileComponent} from './pages/user-profile/user-profile.component';
import {authGuard} from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: DashboardHomeComponent},
      {path: 'profile', component: UserProfileComponent},
      {
        path: 'campaigns',
        loadChildren: () => import('./campaigns/campaigns.module').then(m => m.CampaignsModule)
      },
      // Add more feature modules as needed:
      // { path: 'contributions', loadChildren: () => import('./contributions/contributions.module').then(m => m.ContributionsModule) },
      // { path: 'pledges', loadChildren: () => import('./pledges/pledges.module').then(m => m.PledgesModule) },
      // { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
    ]
  }
];

@NgModule({
  declarations: [
    DashboardLayoutComponent,
    SidebarComponent,
    UserProfileComponent,
    HeaderComponent,
    DashboardHomeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class DashboardModule {
}
