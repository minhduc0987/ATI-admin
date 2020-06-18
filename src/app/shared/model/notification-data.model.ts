import { MessageType } from '../enum/message-type.enum';

export class NotificationData {
	message: any;
	type: MessageType = MessageType.Create;
	duration: number;
	showCloseButton = true;
	showUndoButton = true;
	undoButtonDuration = 3000;
	verticalPosition: 'top' | 'bottom' = 'bottom';
}
