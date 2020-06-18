// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import {AuthGuard, IsSignedInGuard, SvCodeGuard } from './core/auth';

const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('../app/views/pages/auth/auth.module').then(m => m.AuthModule)
	},

	{
		path: '',
		component: BaseComponent,
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('../app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'campaigns-managerment',
				loadChildren: () =>
					import(
						'./views/pages/apps/campaigns-managerment/campaigns-managerment.module'
					).then(m => m.CampaignsManagermentModule)
			},
			{
				path: 'dcnd-managerment',
				loadChildren: () =>
					import(
						'./views/pages/apps/dcnd-managerment/dcnd-managerment.module'
					).then(m => m.DcndManagermentModule)
			},
			{
				path: 'donates-managerment',
				loadChildren: () =>
					import(
						'./views/pages/apps/donates-managerment/donates-managerment.module'
					).then(m => m.DonatesManagermentModule)
			},
			{
				path: 'profile',
				loadChildren: () =>
					import(
						'../app/views/pages/apps/user-profile/user-profile.module'
					).then(m => m.UserProfileModule)
			},
			{
				path: 'user-management',
				loadChildren: () => import('../app/views/pages/apps/user-management/user-management.module').then(m => m.UserManagementModule)
			},
			{
				path: 'user-spam',
				loadChildren: () => import('../app/views/pages/apps/user-spam-mgmt/user-spam-mgmt.module').then(m => m.UserSpamMgmtModule)
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{ path: 'error/:type', component: ErrorPageComponent },
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
		]
	},

	{ path: '**', redirectTo: 'error/403', pathMatch: 'full' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
