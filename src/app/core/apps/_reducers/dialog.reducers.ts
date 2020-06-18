import { DialogActions, DialogActionTypes } from '../_actions/dialog.actions';

export interface DialogState {
	dialogConfirmed: boolean;

}

export const initialDialogState: DialogState = {
	dialogConfirmed: false

};

export function diaglogReducer(state = initialDialogState, action: DialogActions): DialogState {
	switch (action.type) {
		case DialogActionTypes.DialogConfirmed:
			return {
				...state,
				dialogConfirmed: true
			};
		case DialogActionTypes.DialogClosed:
			return {
				...state,
				dialogConfirmed: false
			};
		default:
			return state;
	}
}
