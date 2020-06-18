// Angular
import { Injectable } from '@angular/core';
// RxJS
import { switchMap, map, tap, withLatestFrom, filter } from 'rxjs/operators';
import { defer, Observable, of } from 'rxjs';
// NGRX
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
// User Profile Action
import {
	// AddressLoaded,
	AddressActionTypes,
	// AddressRequested,
	ProvinceRequested,
	ProvinceLoaded,
	DistrictRequested,
	DistrictRequestedSuccess,
	WardRequested,
	WardRequestedSuccess,
	AddressRequestedFailed
} from '../_actions/address.actions';

import { AddressService } from '../_services/address.service';
import { AppState } from '../../reducers';
import { Province } from '../_models/address.model';
import { isProviceLoad } from '../_selectors/address.selectors';

@Injectable()
export class AddressEffects {

	@Effect()
	loadProvince$ = this.actions$
		.pipe(
			ofType<ProvinceRequested>(AddressActionTypes.ProvinceRequested),
			withLatestFrom(this.store.pipe(select(isProviceLoad))),
			filter(([action, isProviceLoad$]) => !isProviceLoad$),
			switchMap(() => {
				// console.log('switchMap action');
				return this.addressService.getProvince().pipe(
					map(result => {
						const province = result as Province[];
						return new ProvinceLoaded({ provinceList: province });
					}, error => {
						return of(new AddressRequestedFailed({ err: error }));
					}),
				);
			})
		);
	@Effect()
	loadDistrict$ = this.actions$
		.pipe(
			ofType<DistrictRequested>(AddressActionTypes.DistrictRequested),
			switchMap((action) => {
				// console.log('switchMap action');
				return this.addressService.getDistrictByProvinceId(action.payload.provinceId).pipe(
					map(result => {
						return new DistrictRequestedSuccess({ districtList: result });
					}, error => {
						return of(new AddressRequestedFailed({ err: error }));
					})
				);
			}),
		);
	@Effect()
	loadWard$ = this.actions$
		.pipe(
			ofType<WardRequested>(AddressActionTypes.WardRequested),
			switchMap((action) => {
				// console.log('switchMap action');
				return this.addressService.getWardByDistrictId(action.payload.districtId).pipe(
					map((result) => {
						return new WardRequestedSuccess({ wardList: result });
					}, error => {
						return of(new AddressRequestedFailed({ err: error }));
					})
				);
			}),
		);


	// @Effect()
	// init$: Observable<Action> = defer(() => {
	// 	return of(new AddressRequested({ searchCondition: null }));
	// });

	// @Effect()
	// init$: Observable<Action> = defer(() => {
	// 	const userToken = localStorage.getItem(environment.authTokenKey);
	// 	let observableResult = of({ type: 'NO_ACTION' });
	// 	if (userToken) {
	// 		observableResult = of(new Login({ authToken: userToken }));
	// 	}
	// 	return observableResult;
	// });

	constructor(
		private actions$: Actions,
		private addressService: AddressService,
		private store: Store<AppState>) {
	}


}
