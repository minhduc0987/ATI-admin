// Angular
import { Component, Inject, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
// RxJS
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificationData } from '../../../../../shared';

@Component({
	selector: 'kt-custom-notification',
	templateUrl: './custom-notification.component.html',
	styleUrls: ['./custom-notification.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	encapsulation: ViewEncapsulation.None
})
export class CustomNotificationComponent implements OnInit {

	messageArray = [];
	messageString: string;
	/**
	 * Component constructor
	 *
	 * @param data: any
	 */
	constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		if (!this.data.showUndoButton || (this.data.undoButtonDuration >= this.data.duration)) {
			return;
		}
		if ((typeof (this.data.message)).toLowerCase() === 'string') {
			console.log(this.data.message);
			this.messageString = this.data.message;
		}
		if ((typeof (this.data.message)).toLowerCase() === 'object') {
			console.log(this.data.message);
			this.messageArray = this.data.message;
		}
		this.delayForUndoButton(this.data.undoButtonDuration).subscribe(() => {
			this.data.showUndoButton = false;
		});
	}

	/*
	 *	Returns delay
	 *
	 * @param timeToDelay: any
	 */
	delayForUndoButton(timeToDelay) {
		return of('').pipe(delay(timeToDelay));
	}

	/**
	 * Dismiss with Action
	 */
	onDismissWithAction() {
		this.data.snackBar.dismiss();
	}

	/**
	 * Dismiss
	 */
	public onDismiss() {
		this.data.snackBar.dismiss();
	}
}
