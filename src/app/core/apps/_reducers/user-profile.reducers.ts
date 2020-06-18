// Actions
import { UserProfileActions, UserProfileActionTypes } from '../_actions/user-profile.actions';
// Models
import { UserProfile } from '../_models/user-profile.model';

export interface UserProfileState {
	userProfile: UserProfile;
	_isUserProfileLoaded: boolean;
	_isLoading: boolean;
	_isUserUpdated: boolean;
	_isError: any;
	isPasswordChange: boolean;
	passwordChangeFailed: any;
	passwordChangeSuccess: any;
}

export const initialUserProfileState: UserProfileState = {
	userProfile: undefined,
	_isUserProfileLoaded: false,
	_isLoading: false,
	_isUserUpdated: false,
	_isError: undefined,
	isPasswordChange: false,
	passwordChangeFailed: null,
	passwordChangeSuccess: null,
};

export function UserProfileReducer(state = initialUserProfileState, action: UserProfileActions): UserProfileState {
	switch (action.type) {
		case UserProfileActionTypes.UserProfileRequested:
			return {
				...state,
				_isUserProfileLoaded: false,
			};

		case UserProfileActionTypes.UserProfileLoaded:
			return {
				...state,
				userProfile: action.payload.userProfile,
				_isUserProfileLoaded: true,
			};

		case UserProfileActionTypes.UserProfileUpdateOnServer:
			return {
				...state,
				// userProfile: undefined,
				_isUserUpdated: false,
				_isError: undefined,
			};

		case UserProfileActionTypes.UserProfileUpdated:
			return {
				...state,
				// userProfile: action.payload.userProfile,
				_isUserUpdated: true,
				_isUserProfileLoaded: false,
			};

		case UserProfileActionTypes.UserProfileCatchError:
			return {
				...state,
				_isError: action.payload.isError,
				// userProfile: undefined
			};
		case UserProfileActionTypes.ChangePasswordOnServer: {
			return {
				...state,
				isPasswordChange: false,
			};
		}
		case UserProfileActionTypes.ChangePasswordSucceed: {
			return {
				...state,
				isPasswordChange: true,
				passwordChangeSuccess: action.payload.result,
			};
		}
		case UserProfileActionTypes.ChangePasswordFailed: {
			return {
				...state,
				passwordChangeFailed: action.payload.result,
			};
		}
		case UserProfileActionTypes.ResetChangePasswordResult: {
			return {
				...state,
				passwordChangeFailed: null,
				passwordChangeSuccess: false,
			};
		}
		case UserProfileActionTypes.ResetUpdateProfileResult: {
			return {
				...state,
				_isError: null,
				_isUserUpdated: null,
			};
		}
		default:
			return state;
	}
}
