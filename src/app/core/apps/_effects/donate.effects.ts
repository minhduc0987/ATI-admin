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
import { DonatesService } from '../../../core/apps/_services';
// State
import { AppState } from '../../../core/reducers';
import {
	DonateActionTypes,
	DonatesPageRequested,
	DonatesPageLoaded,
	DonatesActionToggleLoading,
	DonatesPageToggleLoading,
	DonateSpam,
	DonateSpamSuccess,
	DonateSpamError,
	DonateReject,
	DonateRejectSuccess,
	DonateRejectError,
	DonateApprove,
	DonateApproveSuccess,
	DonateApproveError,
	DonateViewLoad,
	DonateViewLoadSuccess
} from '../_actions/donate.actions';
import { ViewDonate } from '../_models/donate.model';

@Injectable()
export class DonateEffects {
	showPageLoadingDistpatcher = new DonatesPageToggleLoading({
		isLoading: true
	});
	hidePageLoadingDistpatcher = new DonatesPageToggleLoading({
		isLoading: false
	});

	showActionLoadingDistpatcher = new DonatesActionToggleLoading({
		isLoading: true
	});
	hideActionLoadingDistpatcher = new DonatesActionToggleLoading({
		isLoading: false
	});

	@Effect()
	loadDonatesPage$ = this.actions$.pipe(
		ofType<DonatesPageRequested>(DonateActionTypes.DonatesPageRequested),
		mergeMap(({ payload }) => {
			this.store.dispatch(this.showPageLoadingDistpatcher);
			const requestToServer = this.donates.findDonates(payload.page);
			const lastQuery = of(payload.page);
			// tslint:disable-next-line: deprecation
			return forkJoin(requestToServer, lastQuery);
		}),
		map(response => {
			const result: QueryResultsModel = response[0];
			const lastQuery: QueryParamsModel = response[1];
			return new DonatesPageLoaded({
				donates: result.items,
				totalCount: result.totalCount,
				page: lastQuery
			});
		})
	);

	@Effect()
	spamDonate$ = this.actions$.pipe(
		ofType<DonateSpam>(DonateActionTypes.DonateSpam),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.donates.spamDonate(payload.id).pipe(
				map(res => {
					return new DonateSpamSuccess({ id: res });
				}),
				catchError((err) => {
					return of(new DonateSpamError({ err }));
				})
			);
		}),
	);

	@Effect()
	rejectDonate$ = this.actions$.pipe(
		ofType<DonateReject>(DonateActionTypes.DonateReject),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.donates.rejectDonate(payload.id).pipe(
				map(res => {
					return new DonateRejectSuccess({ id: res });
				}),
				catchError((err) => {
					return of(new DonateRejectError({ err }));
				})
			);
		}),
	);

	@Effect()
	approveDonate$ = this.actions$.pipe(
		ofType<DonateApprove>(DonateActionTypes.DonateApprove),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.donates.approveDonate(payload.id).pipe(
				map(res => {
					return new DonateApproveSuccess({ id: res });
				}),
				catchError((err) => {
					return of(new DonateApproveError({ err }));
				})
			);
		}),
	);

	@Effect()
	viewDonatesPage$ = this.actions$.pipe(
		ofType<DonateViewLoad>(DonateActionTypes.DonateViewLoad),
		switchMap(({ payload }) => {
			return this.donates.detailViewDonate(payload.id).pipe(
				map((res) => {
					return new DonateViewLoadSuccess({ donateData: res });
				})
			);
		}),
	);

	constructor(
		private actions$: Actions,
		private donates: DonatesService,
		private store: Store<AppState>
	) {}
}
