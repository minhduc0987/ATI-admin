import { createFeatureSelector, createSelector } from '@ngrx/store';

import { DcndEditState } from '../_reducers/dcnd-edit.reducers';
import { StateEnum } from '../../../shared';

export const selectDcndEditState = createFeatureSelector<DcndEditState>(StateEnum.dcndsEdit);

export const selectDcndCreatedCode = createSelector(
	selectDcndEditState,
	de => de.dcndCode
);

export const isDcndCreated = createSelector(
	selectDcndEditState,
	de => de._isCreated
);

export const selectDcndRequestedError = createSelector(
	selectDcndEditState,
	de => de.errorMes
);

export const isDcndUpdated = createSelector(
	selectDcndEditState,
	de => de._isUpdated
);


export const selectDcndLoadedError = createSelector(
	selectDcndEditState,
	de => de.loadedError
);

export const selectCurrentDcnd = createSelector(
	selectDcndEditState,
	de => de.dcnd
);

