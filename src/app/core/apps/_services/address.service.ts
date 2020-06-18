import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Ward, Province, District } from '../_models/address.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { filter, some, find, each } from 'lodash';

const API_ADDRESS_PROVINCE_URL = environment.apiUrl + 'common/province';
const API_ADDRESS_DISTRICT_URL = environment.apiUrl + 'common/district/';
const API_ADDRESS_WARD_URL = environment.apiUrl + 'common/ward/';


@Injectable()
export class AddressService {
	constructor(private http: HttpClient) { }

	getProvince(): Observable<Province[]> {
		return this.http.get<Province[]>(API_ADDRESS_PROVINCE_URL);
	}

	getDistrictByProvinceId(provinceId: number): Observable<District[]> {
		return this.http.get<District[]>(API_ADDRESS_DISTRICT_URL + provinceId);
	}
	getWardByDistrictId(districtId: number): Observable<Ward[]> {
		return this.http.get<Ward[]>(API_ADDRESS_WARD_URL + districtId);
	}

}
