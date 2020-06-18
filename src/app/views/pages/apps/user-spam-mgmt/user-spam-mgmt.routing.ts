import { SpamListComponent } from './spam-list/spam-list.component';
import { Routes } from '@angular/router';
import { SvCodeGuard } from '../../../../core/auth';

export const routes: Routes = [
	{
		path: '',
		canActivate: [SvCodeGuard],
		data: {
			permission: {
				serviceCode: 'ACCOUNT_LOCK_READ',
			},
		},
		redirectTo: 'list',
		pathMatch: 'full',
	},
	{
		path: 'list',
		canActivate: [SvCodeGuard],
		data: {
			permission: {
				serviceCode: 'ACCOUNT_LOCK_READ',
			},
		},
		component: SpamListComponent,
	},
];
