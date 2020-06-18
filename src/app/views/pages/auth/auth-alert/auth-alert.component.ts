// Angular
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'kt-auth-alert',
	templateUrl: './auth-alert.component.html'
})
export class AuthAlertComponent implements OnInit {
	// Public properties
	@Input() type: 'primary | accent | warn | success';
	@Input() duration: number = 0;
	@Input() showCloseButton: boolean = true;
	@Output() close = new EventEmitter<boolean>();
	alertShowing: boolean = true;

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		if (this.duration === 0) {
			return;
		}

		setTimeout(() => {
			this.closeAlert();
		}, this.duration);
	}

	/**
	 * close alert
	 */
	closeAlert() {
		this.close.emit();
	}
}
