// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap, switchMap, catchError } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';
// Services
import { DcndsService } from '../../../core/apps/_services';
// State
import { AppState } from '../../../core/reducers';
import {
	DcndActionTypes,
	DcndsPageRequested,
	DcndsPageLoaded,
	DcndsActionToggleLoading,
	DcndsPageToggleLoading,
	DcndDeleted,
	DcndOnServerDeleteError,
	DcndOnServerDeleteSuccess,
	DcndOnServerUpdateSuccess,
	DcndOnServerUpdateError,
	DcndUpdated
} from '../_actions/dcnd.actions';

@Injectable()
export class DcndEffects {
	showPageLoadingDistpatcher = new DcndsPageToggleLoading({
		isLoading: true
	});
	hidePageLoadingDistpatcher = new DcndsPageToggleLoading({
		isLoading: false
	});

	showActionLoadingDistpatcher = new DcndsActionToggleLoading({
		isLoading: true
	});
	hideActionLoadingDistpatcher = new DcndsActionToggleLoading({
		isLoading: false
	});

	@Effect()
	loadDcndsPage$ = this.actions$.pipe(
		ofType<DcndsPageRequested>(DcndActionTypes.DcndsPageRequested),
		mergeMap(({ payload }) => {
			this.store.dispatch(this.showPageLoadingDistpatcher);
			const requestToServer = this.dcnds.findDcnds(payload.page);
			const lastQuery = of(payload.page);
			// tslint:disable-next-line: deprecation
			return forkJoin(requestToServer, lastQuery);
		}),
		map(response => {
			const result: QueryResultsModel = response[0];
			const lastQuery: QueryParamsModel = response[1];
			return new DcndsPageLoaded({
				dcnds: result.items,
				totalCount: result.totalCount,
				page: lastQuery
			});
		})
	);

	@Effect()
	updatedDcnd$ = this.actions$.pipe(
		ofType<DcndUpdated>(DcndActionTypes.DcndUpdated),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.dcnds.updateDcnd(payload.id).pipe(
				map(res => {
					return new DcndOnServerUpdateSuccess({ id: res });
				}),
				catchError((err) => {
					return of(new DcndOnServerUpdateError({ err }));
				})
			);
		}),
	);

	@Effect()
	deleteDcnd$ = this.actions$.pipe(
		ofType<DcndDeleted>(DcndActionTypes.DcndDeleted),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.dcnds.deleteDcnd(payload.id).pipe(
				map(res => {
					return new DcndOnServerDeleteSuccess({ id: res });
				}),
				catchError((err) => {
					return of(new DcndOnServerDeleteError({ err }));
				})
			);
		}),
	);

	constructor(
		private actions$: Actions,
		private dcnds: DcndsService,
		private store: Store<AppState>
	) {}
}
