// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { RouterModule } from '@angular/router';
// Share
import { PartialsModule } from '../../../partials/partials.module';
import { CoreModule } from '../../../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Translate
import { TranslateModule } from '@ngx-translate/core';
// Material
import {
	MatInputModule,
	MatTooltipModule,
	MatDatepickerModule,
	MatDialogModule,
	MatProgressBarModule
} from '@angular/material';

// Ng-Bootstrap
import {
	NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ProfileChangePasswordComponent } from './profile-change-password/profile-change-password.component';
import { StoreModule } from '@ngrx/store';
import { UserProfileReducer, UserProfileEffects, AddressReducer, AddressEffects, FileUploadEffects, FileUploadReducer } from '../../../../core/apps';
import { EffectsModule } from '@ngrx/effects';

import { LayoutUtilsService } from '../../../../core/_base/crud';
import {
	ActionNotificationComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent,
	CustomEntityDialogComponent,
	CustomNotificationComponent
} from '../../../partials/content/crud';

@NgModule({
	imports: [
		CommonModule,
		PartialsModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule,
		// Material
		MatInputModule,
		MatTooltipModule,
		MatDatepickerModule,
		MatDialogModule,
		MatProgressBarModule,
		// NgOptionHighlightModule,
		AngularMultiSelectModule,
		NgbDatepickerModule,
		StoreModule.forFeature('userProfile', UserProfileReducer),
		StoreModule.forFeature('address', AddressReducer),
		StoreModule.forFeature('fileUpload', FileUploadReducer),
		EffectsModule.forFeature([UserProfileEffects, AddressEffects, FileUploadEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: ProfileEditComponent
			},
			{
				path: 'password',
				component: ProfileChangePasswordComponent
			},
		]),
	],
	providers: [LayoutUtilsService],
	entryComponents: [
		ActionNotificationComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		DeleteEntityDialogComponent,
		CustomEntityDialogComponent,
		CustomNotificationComponent
	],
	declarations: [ProfileEditComponent, ProfileChangePasswordComponent],
	bootstrap: [ProfileEditComponent]
})
export class UserProfileModule { }
