// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../../core/_base/crud';
// Shared
import {
	ActionNotificationComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
} from '../../../partials/content/crud';
// Components
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule,
	MatSlideToggleModule,
} from '@angular/material';
import { usersReducer, UserEffects, SvCodeGuard } from '../../../../core/auth';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { RoleEditDialogComponent } from './roles/role-edit/role-edit.dialog.component';
import { RoleUsersDialogComponent } from './roles/role-users/role-users.dialog.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../../../../../app/core/core.module';
import { UserProfileReducer, UserProfileEffects } from '../../../../core/apps';
import { SharedModule } from '../../../../shared/shared.module';
const routes: Routes = [
	{
		path: '',
		canActivate: [SvCodeGuard],
		data: {
			permission: {
				serviceCode: 'USER_READ',
			},
		},
		redirectTo: 'users',
		pathMatch: 'full',
	},
	{
		path: 'roles',
		canActivate: [SvCodeGuard],
		data: {
			permission: {
				serviceCode: 'ROLE_READ',
			},
		},
		component: RolesListComponent,
	},
	{
		path: 'users',
		canActivate: [SvCodeGuard],
		data: {
			permission: {
				serviceCode: 'USER_READ',
			},
		},
		component: UsersListComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature('users', usersReducer),
		StoreModule.forFeature('userProfile', UserProfileReducer),
		EffectsModule.forFeature([UserEffects, UserProfileEffects]),
		FormsModule,
		AngularMultiSelectModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		CoreModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatExpansionModule,
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule,
		MatSlideToggleModule,
		NgbPaginationModule,
		SharedModule,
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true,
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px',
			},
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService,
	],
	entryComponents: [
		ActionNotificationComponent,
		UserEditComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		RoleEditDialogComponent,
		RoleUsersDialogComponent,
	],
	declarations: [UsersListComponent, UserEditComponent, RolesListComponent, RoleEditDialogComponent, RoleUsersDialogComponent],
})
export class UserManagementModule {}
