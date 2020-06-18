// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { Logout } from '../../../../../core/auth';
import { environment } from '../../../../../../environments/environment';
import { isUserUpdated, UserProfileRequested, currentUserProfile, UserProfile } from '../../../../../core/apps';

@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<UserProfile>;
	imgURL: string;
	@Input() avatar = true;
	@Input() greeting = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState>) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.userReload();
	}

	// ngAfterViewInit() {
	// 	this.userReload();
	// }

	userReload() {
		this.store.dispatch(new UserProfileRequested());
		this.user$ = this.store.pipe(select(currentUserProfile));
		const userSub = this.user$.subscribe(user => {
			if (user) {
				// const userToken = localStorage.getItem(environment.authTokenKey);
				// this.imgURL = `${user.pic}/${userToken}`;
				this.imgURL = user.pic;

				// if (userSub) {
				// 	userSub.unsubscribe();
				// }
			} else {
				this.store.dispatch(new UserProfileRequested());
			}
		}, err => {
			this.logout();
		});
	}
	/**
	 * Log out
	 */
	logout() {
		this.store.dispatch(new Logout());
	}
}
