// Actions
import { AddressActions, AddressActionTypes } from '../_actions/address.actions';
// Models
import { Province, District, Ward } from '../_models/address.model';
import { HttpErrorResponse } from '@angular/common/http';


export interface AddressState {
	provinceList: Province[];
	districtList: District[];
	wardList: Ward[];
	_isProvinceLoaded: boolean;
	_isLoading: boolean;
	addressError: HttpErrorResponse;
}

export const initialAddressState: AddressState = {
	provinceList: undefined,
	districtList: undefined,
	wardList: undefined,
	_isProvinceLoaded: false,
	_isLoading: false,
	addressError: undefined
};


export function AddressReducer(state = initialAddressState, action: AddressActions): AddressState {
	switch (action.type) {
		// Province
		case AddressActionTypes.ProvinceRequested:
			return {
				...state,
				_isProvinceLoaded: false,
			};

		case AddressActionTypes.ProvinceLoaded:
			return {
				...state,
				provinceList: action.payload.provinceList,
				_isProvinceLoaded: true,
			};

		// District
		case AddressActionTypes.DistrictRequested:
			return {
				...state,
			};

		case AddressActionTypes.DistrictRequestedSuccess:
			return {
				...state,
				districtList: action.payload.districtList,
			};

		// Ward
		case AddressActionTypes.WardRequested:
			return {
				...state,
			};

		case AddressActionTypes.WardRequestedSuccess:
			return {
				...state,
				wardList: action.payload.wardList,
			};

		case AddressActionTypes.AddressRequestedFailed:
			return {
				...state,
				addressError: action.payload.err
			};
		default:
			return state;
	}
}
