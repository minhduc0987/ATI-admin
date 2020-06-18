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
	ImagePreviewComponent
} from '../../../partials/content/crud';
// Components
import { DonatesListComponent } from './donates-list/donates-list.component';
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
import { DonateEffects } from '../../../../core/apps';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DonateViewComponent } from './donate-view/donate-view.component';
import { SvCodeGuard } from '../../../../core/auth';
import { CoreModule } from '../../../../core/core.module';
import { donatesReducer } from '../../../../core/apps/_reducers/donate.reducers';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'list',
		pathMatch: 'full',
		canActivate: [SvCodeGuard],
		data: {
			permission: {
				serviceCode: 'PLAN_READ',
			},
		},
	},
	{
		path: 'list',
		component: DonatesListComponent,
		canActivate: [SvCodeGuard],
		data: {
			permission: {
				serviceCode: 'PLAN_READ',
			},
		},
	},
	{
		path: 'view',
		children: [
			{
				path: '',
				canActivate: [SvCodeGuard],
				data: {
					permission: {
						serviceCode: 'PLAN_READ',
					},
				},
				component: DonateViewComponent,
			},
			{
				path: ':id',
				canActivate: [SvCodeGuard],
				data: {
					permission: {
						serviceCode: 'PLAN_READ',
					},
				},
				component: DonateViewComponent,
			},
		],
	},
];

@NgModule({
	imports: [
		CKEditorModule,
		CommonModule,
		HttpClientModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature('donates', donatesReducer),
		EffectsModule.forFeature([DonateEffects]),
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
		ImagePreviewComponent
	],
	declarations: [
		DonatesListComponent,
		DonateViewComponent,
	]
})
export class DonatesManagermentModule {}
