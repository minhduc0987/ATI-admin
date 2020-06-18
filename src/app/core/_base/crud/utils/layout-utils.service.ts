// Angular
import { Injectable } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
// Partials for CRUD
import {
	ActionNotificationComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent,
	CustomEntityDialogComponent,
	CustomNotificationComponent,
	ImagePreviewComponent,
	CustomInputDialogComponent,
	ImagePreviewCampaignComponent,
} from '../../../../views/partials/content/crud';

import { MessageType } from '../../../../shared/index';

@Injectable()
export class LayoutUtilsService {
	/**
	 * Service constructor
	 *
	 * @param snackBar: MatSnackBar
	 * @param dialog: MatDialog
	 */
	constructor(private snackBar: MatSnackBar, private dialog: MatDialog) { }

	/**
	 * Showing (Mat-Snackbar) Notification
	 *
	 * @param message: string
	 * @param type: MessageType
	 * @param duration: number
	 * @param showCloseButton: boolean
	 * @param showUndoButton: boolean
	 * @param undoButtonDuration: number
	 * @param verticalPosition: 'top' | 'bottom' = 'top'
	 */
	showActionNotification(
		message$: string,
		type$: MessageType = MessageType.Create,
		duration$: number = 3000,
		showCloseButton$: boolean = true,
		showUndoButton$: boolean = true,
		undoButtonDuration$: number = 3000,
		verticalPosition$: 'top' | 'bottom' = 'bottom'
	) {
		const data$ = {
			message: message$,
			snackBar: this.snackBar,
			showCloseButton: showCloseButton$,
			showUndoButton: showUndoButton$,
			undoButtonDuration: undoButtonDuration$,
			verticalPosition: verticalPosition$,
			type: type$,
			action: 'Undo'
		};
		this.snackBar.dismiss();
		return this.snackBar.openFromComponent(ActionNotificationComponent, {
			duration: duration$,
			data: data$,
			verticalPosition: verticalPosition$
		});
	}

	/**
	 * Showing Confirmation (Mat-Dialog) before Entity Removing
	 *
	 * @param title: stirng
	 * @param description: stirng
	 * @param waitDesciption: string
	 */
	deleteElement(
		title: string = '',
		description: string = '',
		waitDesciption: string = '',
	) {
		this.dialog.closeAll();
		return this.dialog.open(DeleteEntityDialogComponent, {
			data: { title, description, waitDesciption },
			width: '440px'
		});
	}

	/**
	 * Showing Fetching Window(Mat-Dialog)
	 *
	 * @param _data: any
	 */
	fetchElements(data$) {
		this.dialog.closeAll();
		return this.dialog.open(FetchEntityDialogComponent, {
			data: data$,
			width: '400px'
		});
	}

	/**
	 * Showing Update Status for Entites Window
	 *
	 * @param title: string
	 * @param statuses: string[]
	 * @param messages: string[]
	 */
	updateStatusForEntities(title, statuses, messages) {
		this.dialog.closeAll();
		return this.dialog.open(UpdateStatusDialogComponent, {
			data: { title, statuses, messages },
			width: '480px'
		});
	}

	/**
	 * Showing comfirm update for Entites Window
	 *
	 * @param title: string
	 * @param description: string
	 * @param waitDesciption: string
	 * @param buttonLeft: string
	 * @param buttonRight: string
	 */
	customeElement(
		title: string = '',
		description: string = '',
		waitDesciption: string = '',
		buttonLeft: string = '',
		buttonRight: string = '',
	) {
		this.dialog.closeAll();
		return this.dialog.open(CustomEntityDialogComponent, {
			data: { title, description, waitDesciption, buttonLeft, buttonRight },
			width: '440px',
			disableClose: true
		});
	}

	/**
	 * * Showing (Mat-Snackbar) Notification
	 *
	 * @param message: (any) string for 1 line and Array for multiple line
	 * @param type: MessageType
	 * @param duration: number
	 * @param showCloseButton: boolean
	 * @param showUndoButton: boolean
	 * @param undoButtonDuration: number
	 * @param verticalPosition: 'top' | 'bottom' = 'top'
	 */
	showCustomNotification(
		message$: any,
		type$: MessageType = MessageType.Create,
		duration$: number = 3000,
		showCloseButton$: boolean = true,
		showUndoButton$: boolean = true,
		undoButtonDuration$: number = 3000,
		verticalPosition$: 'top' | 'bottom' = 'bottom'
	) {
		const data$ = {
			message: message$,
			snackBar: this.snackBar,
			showCloseButton: showCloseButton$,
			showUndoButton: showUndoButton$,
			undoButtonDuration: undoButtonDuration$,
			verticalPosition: verticalPosition$,
			type: type$,
			action: 'Undo'
		};
		this.dialog.closeAll();
		return this.snackBar.openFromComponent(CustomNotificationComponent, {
			duration: duration$,
			data: data$,
			verticalPosition: verticalPosition$
		});
	}

	customInputElement(
		title: string = '',
		description: string = '',
		buttonLeft: string = '',
		buttonRight: string = '',
	) {
		this.dialog.closeAll();
		return this.dialog.open(CustomInputDialogComponent, {
			data: { title, description, buttonLeft, buttonRight },
			width: '600px',
			disableClose: true
		});
	}


	/**
	 * Showing Image Preview
	 *
	 * @param accept: string
	 * @param documentType: string
	 * @param humanityId: string
	 *
	 */
	imagePreviewDialog(
		// multiple?: boolean,
		type?: string,
		accept?: string,
		documentType?: string,
		humanityId?: number,
		fileList?: any[],
		isGalleryDisable?: boolean

	) {
		this.dialog.closeAll();
		return this.dialog.open(ImagePreviewComponent, {
			data: { type, accept, documentType, humanityId, fileList, isGalleryDisable },
			width: '1112px',
			disableClose: true
		});
	}

	imagePreviewCampaignDialog(
		// multiple?: boolean,
		type?: string,
		accept?: string,
		documentType?: string,
		campaignId?: number,
		fileList?: any[],
		isGalleryDisable?: boolean

	) {
		this.dialog.closeAll();
		return this.dialog.open(ImagePreviewCampaignComponent, {
			data: { type, accept, documentType, campaignId, fileList, isGalleryDisable },
			width: '1112px',
			disableClose: true
		});
	}
}
