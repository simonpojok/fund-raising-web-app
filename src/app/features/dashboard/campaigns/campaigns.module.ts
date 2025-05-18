import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {SharedModule} from '../../../shared/shared.module';
import {
  CampaignBasicInfoComponent,
  CampaignDetailsComponent,
  CampaignPreviewComponent, CampaignSettingsComponent,
  CreateCampaignComponent, CreateCampaignStepperComponent
} from './pages/create-campaign';
import {CreateCampaignService} from './pages/create-campaign';
import {authGuard} from '../../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {path: 'create', component: CreateCampaignComponent},
      // Future routes:
      // { path: ':id', component: CampaignDetailComponent },
      // { path: ':id/edit', component: EditCampaignComponent },
      // { path: ':id/contribute', component: ContributeComponent },
      // { path: ':id/pledge', component: PledgeComponent },
    ]
  }
];

@NgModule({
  declarations: [
    CreateCampaignComponent,
    CampaignBasicInfoComponent,
    CampaignDetailsComponent,
    CampaignPreviewComponent,
    CampaignSettingsComponent,
    CreateCampaignStepperComponent,
    CreateCampaignComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    CreateCampaignService
  ]
})
export class CampaignsModule {
}
