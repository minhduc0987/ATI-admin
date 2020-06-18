import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StateEnum } from '../../../shared';
import { DialogState } from '../_reducers/dialog.reducers';

export const selectDialogState = createFeatureSelector<DialogState>(StateEnum.dialog);

export const isDialogConfirmed = createSelector(
	selectDialogState,
	state => state.dialogConfirmed
);
