// Angular
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'kt-custom-input-dialog',
	templateUrl: './custom-input-dialog.component.html',
	styleUrls: ['./custom-input-dialog.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class CustomInputDialogComponent implements OnInit {
	// Public properties
	viewLoading = false;
	hasErrors;
	textRefuse;
	inputForm: FormGroup;
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<CustomInputDialogComponent>
	 * @param data: any
	 */
	constructor(
		public dialogRef: MatDialogRef<CustomInputDialogComponent>,
		private translate: TranslateService,
		private inputFB: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.createForm();
	}

	/**
	 * Close dialog with false result
	 */
	onNoClick(): void {
		this.dialogRef.close();
	}
	createForm() {
		this.inputForm = this.inputFB.group({
			textRefuse: [ this.textRefuse,
				Validators.compose([
					Validators.maxLength(100),
				])
			]
		});
	}

	/**
	 * Close dialog with true result
	 */
	onSubmit(): void {
		/* Server loading imitation. Remove this */
		if ( this.inputForm.invalid ) {
			this.hasErrors = true;
		} else {
			this.hasErrors = false;
			this.viewLoading = true;
			setTimeout(() => {
				const content = this.inputForm.value.textRefuse;
				this.dialogRef.close({content, hasContent: true });
			}, 2500);
		}
	}
}
