// NGRX
import { createSelector, createFeatureSelector, select } from '@ngrx/store';
// Models

import { UserProfileState } from '../_reducers/user-profile.reducers';

export const selectUserProfileState = createFeatureSelector<UserProfileState>('userProfile');


export const isUserProfileLoaded = createSelector(
	selectUserProfileState,
	up => up._isUserProfileLoaded
);

export const currentUserProfile = createSelector(
	selectUserProfileState,
	up => up.userProfile
);

export const isUserUpdated = createSelector(
	selectUserProfileState,
	up => up._isUserUpdated
);

export const isUserProfileError = createSelector(
	selectUserProfileState,
	up => up._isError
);

export const isChangePasswordSucceed = createSelector(
	selectUserProfileState,
	usersState => usersState.isPasswordChange
);

export const passwordChangeSuccess = createSelector(
	selectUserProfileState,
	usersState => usersState.passwordChangeSuccess
);

export const passwordChangeFailed = createSelector(
	selectUserProfileState,
	usersState => usersState.passwordChangeFailed
);
