import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {ThemeService} from './services/theme.service';
import {AuthService} from './services/auth.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    ThemeService,
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    provideHttpClient(),
  ],
  exports: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
