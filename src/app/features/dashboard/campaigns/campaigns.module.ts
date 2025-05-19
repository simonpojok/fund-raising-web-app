import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {SharedModule} from '../../../shared/shared.module';
import {authGuard} from '../../../core/guards/auth.guard';
import {
  BasicInfoCardComponent
} from './pages/create-campaign/components/basic-info-card/basic-info-card.component';
import {
  SettingsPaymentCardComponent
} from './pages/create-campaign/components/settings-payment-card/settings-payment-card.component';
import {CreateCampaignComponent} from './pages/create-campaign/create-campaign.component';
import {CreateCampaignService} from './services/create-campaign.service';
import {CampaignsFiltersComponent} from './components/campaigns-filters/campaigns-filters.component';
import {CampaignsGridComponent} from './components/campaigns-grid/campaigns-grid.component';
import {CampaignsListComponent} from './pages/campaigns-list/campaigns-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: CampaignsListComponent,
        data: {title: 'All Campaigns'}
      },
      {path: 'create', component: CreateCampaignComponent},
      // Future routes:
      // { path: ':id', component: e },
      // { path: ':id/edit', component: EditCampaignComponent },
      // { path: ':id/contribute', component: ContributeComponent },
      // { path: ':id/pledge', component: PledgeComponent },
    ]
  }
];

@NgModule({
  declarations: [
    CreateCampaignComponent,
    BasicInfoCardComponent,
    SettingsPaymentCardComponent,
    CampaignsFiltersComponent,
    CampaignsGridComponent,
    CampaignsListComponent,
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
