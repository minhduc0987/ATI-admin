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
import { UserSpamsReducer, UserSpamEffects, diaglogReducer } from '../../../../core/apps';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../../../../core/core.module';
import { routes } from './user-spam-mgmt.routing';

// Component
import { SpamListComponent } from './spam-list/spam-list.component';
import { StateEnum } from '../../../../shared';



@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature(StateEnum.userSpam, UserSpamsReducer),
		StoreModule.forFeature(StateEnum.dialog, diaglogReducer),
		EffectsModule.forFeature([UserSpamEffects]),
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
	declarations: [SpamListComponent],

})
export class UserSpamMgmtModule { }
