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
	CustomEntityDialogComponent,
	ImagePreviewComponent,
	CustomInputDialogComponent,
	CustomNotificationComponent,
} from '../../../partials/content/crud';
// Components
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
import {
	dcndsReducer,
	DcndEffects,
	AddressEffects,
	AddressReducer,
	FileUploadReducer,
	FileUploadEffects,
	DcndEditEffects,
	dcndsEditReducer,
} from '../../../../core/apps';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DcndManagermentListComponent } from './dcnd-managerment-list/dcnd-managerment-list.component';
import { DcndManagermentEditComponent } from './dcnd-managerment-edit/dcnd-managerment-edit.component';

// CKEditor
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { StateEnum } from '../../../../shared';
import { CoreModule } from '../../../../core/core.module';
import { SvCodeGuard } from '../../../../core/auth';

const routes: Routes = [
	{
		path: '',
		canActivate: [SvCodeGuard],
		data: {
			permission: {
				serviceCode: 'DCND_READ',
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
				serviceCode: 'DCND_READ',
			},
		},
		component: DcndManagermentListComponent,
	},
	{
		path: ':action',
		children: [
			{
				path: '',
				canActivate: [SvCodeGuard],
				data: {
					permission: {
						serviceCode: 'DCND_CREATE',
					},
				},
				component: DcndManagermentEditComponent,
			},
			{
				path: ':id',
				canActivate: [SvCodeGuard],
				data: {
					permission: {
						serviceCode: 'DCND_MODIFY',
					},
				},
				component: DcndManagermentEditComponent,
			},
		],
	},
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature('dcnds', dcndsReducer),
		StoreModule.forFeature(StateEnum.dcndsEdit, dcndsEditReducer),
		StoreModule.forFeature(StateEnum.address, AddressReducer),
		StoreModule.forFeature(StateEnum.fileUpload, FileUploadReducer),
		EffectsModule.forFeature([DcndEffects, AddressEffects, FileUploadEffects, DcndEditEffects]),
		FormsModule,
		CoreModule,
		AngularMultiSelectModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
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
		CKEditorModule,
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
		CustomEntityDialogComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		CustomInputDialogComponent,
		ImagePreviewComponent,
		CustomNotificationComponent,
	],
	declarations: [DcndManagermentListComponent, DcndManagermentEditComponent],
})
export class DcndManagermentModule { }
