// Angular
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Material
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatIconModule } from '@angular/material';
// Translate
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// CRUD
import { InterceptService } from '../../../core/_base/crud/';
// Module components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
import { AuthAlertComponent } from './auth-alert/auth-alert.component';
// Auth
import { AuthEffects, AuthGuard, IsSignedInGuard, authReducer, AuthService, SvCodeGuard } from '../../../core/auth';
import { SharedModule } from '../../../shared/shared.module';
import { UserProfileReducer, UserProfileEffects } from '../../../core/apps';
// import { CampaignsService } from '../../../core/apps';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full',
			},
			{
				path: 'login',
				component: LoginComponent,
				data: { returnUrl: window.location.pathname },
			},
			{
				path: 'forgot-password',
				component: ForgotPasswordComponent,
			},
		],
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatIconModule,
		RouterModule.forChild(routes),
		MatInputModule,
		MatFormFieldModule,
		MatCheckboxModule,
		TranslateModule.forChild(),
		StoreModule.forFeature('auth', authReducer),
		EffectsModule.forFeature([AuthEffects]),
		SharedModule,
		StoreModule.forFeature('userProfile', UserProfileReducer),
		EffectsModule.forFeature([AuthEffects, UserProfileEffects]),
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true,
		},
	],
	exports: [AuthComponent],
	declarations: [AuthComponent, LoginComponent, ForgotPasswordComponent, AuthNoticeComponent, AuthAlertComponent],
})
export class AuthModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AuthModule,
			providers: [
				AuthService,
				// CampaignsService,
				AuthGuard,
				IsSignedInGuard,
				SvCodeGuard,
			],
		};
	}
}
