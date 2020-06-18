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
import {
	HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';
// Shared
import {
	ActionNotificationComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	CustomInputDialogComponent,
	ImagePreviewComponent,
	CustomEntityDialogComponent,
	CustomNotificationComponent,
	ImagePreviewCampaignComponent
} from '../../../partials/content/crud';
// Components
import { CampaignsListComponent } from './campaigns-list/campaigns-list.component';
import { CampaignsEditComponent } from './campaigns-edit/campaigns-edit.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

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
import { CampaignEffects, campaignsReducer, dcndsReducer,
	DcndEffects, FileUploadEffects, FileUploadReducer,
	AddressReducer, AddressEffects } from '../../../../core/apps';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectDcndsComponent } from './select-dcnds/select-dcnds.component';
import { CoreModule } from '../../../../core/core.module';
import { SvCodeGuard } from '../../../../core/auth/_guards/user.guard';
import { StateEnum } from '../../../../shared';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'list',
		pathMatch: 'full',
		data: {
			permission: {
				serviceCode: 'CAMPAIGN_READ',
			},
		},
	},
	{
		path: 'list',
		component: CampaignsListComponent,
		data: {
			permission: {
				serviceCode: 'CAMPAIGN_READ',
			},
		},
	},
	{
		path: 'create',
		component: CampaignsEditComponent,
		// canActivate: [SvCodeGuard],
		data: {
			permission: {
				serviceCode: 'CAMPAIGN_CREATE',
			},
		},
	},
];

@NgModule({
	imports: [
		CKEditorModule,
		CommonModule,
		CoreModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature('dcnds', dcndsReducer),
		StoreModule.forFeature('campaigns', campaignsReducer),
		StoreModule.forFeature(StateEnum.address, AddressReducer),
		StoreModule.forFeature(StateEnum.fileUpload, FileUploadReducer),
		EffectsModule.forFeature([CampaignEffects, DcndEffects, FileUploadEffects, AddressEffects]),
		FormsModule,
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
		NgbPaginationModule
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		CustomInputDialogComponent,
		ImagePreviewCampaignComponent,
		SelectDcndsComponent,
		CustomNotificationComponent
	],
	declarations: [
		CampaignsListComponent,
		CampaignsEditComponent,
		SelectDcndsComponent,
	]
})
export class CampaignsManagermentModule {}
