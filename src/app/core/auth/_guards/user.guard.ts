// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, } from '@angular/router';
// RxJS
// NGRX
// Module reducers and selectors
import { UserProfileService } from '../../apps/_services/user-profile.service';
import { environment } from '../../../../environments/environment';


@Injectable()
export class SvCodeGuard implements CanActivate {
	constructor(
		private userprofileservice: UserProfileService
	) { }

	canActivate( route: ActivatedRouteSnapshot ): boolean {

		const token = localStorage.getItem(environment.authTokenKey);
		const currentUser = this.userprofileservice.currentUserValue;
		const permission = route.data['permission'];
		if (token && token !== '') {
			let canActivate: boolean;
			const serviceCode = [];
			if (currentUser) {
				const role: any = currentUser.roles;
				if (role) {
					for (const fnRole of role ) {
						if (fnRole.functions) {
							for (const element of fnRole.functions) {
								if (element.services[0].serviceCode) {
									if (!serviceCode.includes(element.services[0].serviceCode)) {
										serviceCode.push(element.services[0].serviceCode);
									}
								}
							}
						}
					}
				}
			}
			serviceCode.forEach(a => {
				if (permission.serviceCode === a) {
					canActivate = true;
				}
			});
			return canActivate;
		}
		return false;
	}
}
