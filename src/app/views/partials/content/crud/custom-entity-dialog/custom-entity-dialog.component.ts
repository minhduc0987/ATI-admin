// Angular
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '../../../../../core/reducers';
import { Store } from '@ngrx/store';
import { DialogConfirmed, DialogClosed } from '../../../../../core/apps/_actions/dialog.actions';

@Component({
	selector: 'kt-custom-entity-dialog',
	templateUrl: './custom-entity-dialog.component.html',
})
export class CustomEntityDialogComponent implements OnDestroy {
	// Public properties
	viewLoading = false;
	showDescription = false;
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<CustomEntityDialogComponent>
	 * @param data: any
	 */
	constructor(
		public dialogRef: MatDialogRef<CustomEntityDialogComponent>,
		private translate: TranslateService,
		private store: Store<AppState>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	// ngOnInit() {

	// }
	ngOnDestroy() {
		this.store.dispatch(new DialogClosed());
	}

	/**
	 * Close dialog with false result
	 */
	onNoClick(): void {
		this.dialogRef.close();
	}

	/**
	 * Close dialog with true result
	 */
	onYesClick(): void {
		/* Server loading imitation. Remove this */
		this.viewLoading = true;
		this.store.dispatch(new DialogConfirmed());
	}
}
