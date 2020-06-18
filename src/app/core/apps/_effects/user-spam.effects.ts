// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap, switchMap, catchError } from 'rxjs/operators';
import { Observable, defer, of, forkJoin, Subscription } from 'rxjs';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';
// Services
import { UserSpamService } from '../../../core/apps/_services';
// State
import { AppState } from '../../../core/reducers';
import {
	UserSpamActionTypes,
	UserSpamsPageRequested,
	UserSpamsPageLoaded,
	UserSpamsActionToggleLoading,
	UserSpamsPageToggleLoading,
	UserSpamOnServerUpdateSuccess,
	UserSpamOnServerUpdateError,
	UserSpamUpdated,
	UserSpamErr
} from '../_actions/user-spam.actions';

@Injectable()
export class UserSpamEffects {
	showPageLoadingDistpatcher = new UserSpamsPageToggleLoading({
		isLoading: true
	});
	hidePageLoadingDistpatcher = new UserSpamsPageToggleLoading({
		isLoading: false
	});

	showActionLoadingDistpatcher = new UserSpamsActionToggleLoading({
		isLoading: true
	});
	hideActionLoadingDistpatcher = new UserSpamsPageToggleLoading({
		isLoading: false
	});

	@Effect()
	loadUserSpamsPage$ = this.actions$.pipe(
		ofType<UserSpamsPageRequested>(UserSpamActionTypes.UserSpamsPageRequested),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showPageLoadingDistpatcher);
			return this.userSpam.findUserSpams(payload.page).pipe(
				map(res => {
					this.store.dispatch(this.hidePageLoadingDistpatcher);
					return new UserSpamsPageLoaded(
						{
							userSpam: res.items,
							totalCount: res.totalCount,
							page: payload.page
						}
					);
				}),
				catchError(err => {
					this.store.dispatch(this.hidePageLoadingDistpatcher);
					return of(new UserSpamErr({ error: err }));
				})
			);
		}));

	@Effect()
	updatedUserSpam$ = this.actions$.pipe(
		ofType<UserSpamUpdated>(UserSpamActionTypes.UserSpamUpdated),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.userSpam.updateUserSpam(payload.userSpamUpdate).pipe(
				map(res => {
					this.store.dispatch(this.hideActionLoadingDistpatcher);
					return new UserSpamOnServerUpdateSuccess();
				}),
				catchError((err) => {
					this.store.dispatch(this.hideActionLoadingDistpatcher);
					return of(new UserSpamOnServerUpdateError({ err }));
				})
			);
		}),
	);

	// @Effect()
	// deleteUserSpam$ = this.actions$.pipe(
	// 	ofType<UserSpamDeleted>(UserSpamActionTypes.UserSpamDeleted),
	// 	switchMap(({ payload }) => {
	// 		this.store.dispatch(this.showActionLoadingDistpatcher);
	// 		return this.userSpam.deleteUserSpam(payload.userSpamId).pipe(
	// 			map(res => {
	// 				return new UserSpamOnServerDeleteSuccess({ userSpamId: res });
	// 			}),
	// 			catchError((err) => {
	// 				return of(new UserSpamOnServerDeleteError({ err }));
	// 			})
	// 		);
	// 	}),
	// );

	constructor(
		private actions$: Actions,
		private userSpam: UserSpamService,
		private store: Store<AppState>
	) { }
}
