import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AddressState } from '../_reducers/address.reducers';
// import { state } from '@angular/animations';

export const selectAddressState = createFeatureSelector<AddressState>('address');

export const isProviceLoad = createSelector(
	selectAddressState,
	state => state._isProvinceLoaded
);

export const currentProvince = createSelector(
	selectAddressState,
	state => state.provinceList
);

export const currentDistrict = createSelector(
	selectAddressState,
	state => state.districtList
);

export const currentWard = createSelector(
	selectAddressState,
	state => state.wardList
);

export const selectAddressError = createSelector(
	selectAddressState,
	state => state.addressError
);
