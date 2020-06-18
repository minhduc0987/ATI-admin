// Angular
import { Injectable } from '@angular/core';
// RxJS
import { switchMap, map, tap, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { defer, Observable, of } from 'rxjs';
// NGRX
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
// User Profile Action
import {
	UserProfileLoaded,
	UserProfileActionTypes,
	UserProfileRequested,
	UserProfileUpdateOnServer,
	UserProfileUpdated,
	UserProfileCatchError,
	ChangePasswordOnServer,
	ChangePasswordSucceed,
	ChangePasswordFailed
} from '../_actions/user-profile.actions';

import { UserProfileService } from '../_services/user-profile.service';
import { AppState } from '../../reducers';
import { isUserProfileLoaded } from '../_selectors/user-profile.selectors';
import { LayoutUtilsService } from '../../_base/crud';
import { TranslateService } from '@ngx-translate/core';
import { MessageType } from '../../../shared';
import { ErrorResponse } from '..';
import { Logout } from '../../auth';

@Injectable()
export class UserProfileEffects {

	// showActionLoadingDistpatcher = new UsersProfileActionToggleLoading({ isLoading: true });
	// hideActionLoadingDistpatcher = new UsersProfileActionToggleLoading({ isLoading: false });

	@Effect()
	loadUserProfile$ = this.actions$
		.pipe(
			ofType<UserProfileRequested>(UserProfileActionTypes.UserProfileRequested),
			// withLatestFrom(this.store.pipe(select(isUserProfileLoaded))),
			// withLatestFrom((action) => UserProfileActionTypes.UserProfileRequeste	d),
			// filter(([action, isUserProfileLoaded$]) => !isUserProfileLoaded$),
			switchMap(() => this.userProfileService.getUserProfile().pipe(
				map(result => {
					return new UserProfileLoaded({ userProfile: result });
				}),
				catchError(err => {
					// tslint:disable-next-line: no-unused-expression
					this.store.dispatch(new Logout());
					return of(new UserProfileCatchError({ isError: err }));
				})
			))
		);

	@Effect()
	updateUserProfile$ = this.actions$
		.pipe(
			ofType<UserProfileUpdateOnServer>(UserProfileActionTypes.UserProfileUpdateOnServer),
			switchMap(({ payload }) => {
				return this.userProfileService.updateUserProfile(payload.userProfile).pipe(
					map(res => {
						return new UserProfileUpdated({ userProfile: res });
					}), catchError(res => {
						return of(new UserProfileCatchError({ isError: res }));
					})
				);
			})
		);

	// @Effect()
	// init$: Observable<Action> = defer(() => {
	// 	return of(new UserProfileRequested());
	// });

	@Effect()
	changePasswordLoad$ = this.actions$.pipe(
		ofType<ChangePasswordOnServer>(UserProfileActionTypes.ChangePasswordOnServer),
		switchMap(({ payload }) => {
			return this.userProfileService.changePassword(payload.passwordObj).pipe(
				map(res => {
					return new ChangePasswordSucceed({ result: res });
				}),
				catchError(
					res => {
						return of(new ChangePasswordFailed({ result: res }));
					})
			);
		}),
	);
	constructor(
		private actions$: Actions,
		private userProfileService: UserProfileService,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService,
		private translateService: TranslateService) {

	}


}
