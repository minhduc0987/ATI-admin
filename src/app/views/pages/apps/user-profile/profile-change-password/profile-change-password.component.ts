import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { UserProfile, currentUserProfile, UserProfileRequested, ResetChangePasswordResult } from '../../../../../core/apps';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { ChangePassword, passwordChangeSuccess, ChangePasswordOnServer, passwordChangeFailed } from '../../../../../core/apps';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import { MessageType } from '../../../../../shared';
@Component({
	selector: 'kt-profile-change-password',
	templateUrl: './profile-change-password.component.html',
	styleUrls: ['./profile-change-password.component.scss']
})
export class ProfileChangePasswordComponent implements OnInit, OnDestroy {
	formGroup: FormGroup;
	USER: Observable<UserProfile>;
	userName: string;
	isLoading: boolean;
	private subscriptions: Subscription[] = [];

	/** Component constructor
	 *
	 * @param formBuilder: FormBuilder,
	 * @param store: Store<AppState>
	 * @param layoutUtilsService: LayoutUtilsService
	 *  @param translateService: TranslateService
	 */

	constructor(
		private formBuilder: FormBuilder,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService,
		private translateService: TranslateService,
		private router: Router
	) {
		this.isLoading = false;
	}

	ngOnInit() {
		this.initChangePasswordForm();
		// this.store.dispatch(new UserProfileRequested());
		this.store.pipe(select(currentUserProfile)).subscribe(res => {
			if (res) {
				this.userName = res.username;
			}
		});
		this.onUpdated();
	}

	/**
	 * ngOnDestroy
	 */
	ngOnDestroy() {
		this.store.dispatch(new ResetChangePasswordResult());
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	initChangePasswordForm() {
		this.formGroup = this.formBuilder.group({
			oldPassword: [null, Validators.compose([
				Validators.required,
				Validators.minLength(6),
				// Validators.maxLength(30)
			])],
			newPassword: [null, Validators.compose([
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(30)

			])],
			confirmPassword: [null, Validators.compose([
				Validators.required,
				Validators.minLength(6),
				// Validators.maxLength(30),

			])]
		}, { validators: Validators.compose([this.isPasswordMatch, this.isPasswordDuplicate, this.isPasswordHasSpecialCharacter]) });
	}

	isPasswordHasSpecialCharacter(group: AbstractControl): { passwordHasSpecialCharacter: boolean } {
		const pass = group.get('newPassword').value;
		const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
		if (pass && !format.test(pass)) {
			return { passwordHasSpecialCharacter: true };
		}
	}

	isPasswordDuplicate(group: AbstractControl): { passwordNotMatch: boolean } {
		const pass = group.get('newPassword').value;
		const confirmPass = group.get('confirmPassword').value;
		if (!confirmPass) { return; }
		if (pass !== confirmPass) {
			return { passwordNotMatch: true };
		}
	}

	isPasswordMatch(group: AbstractControl): { passwordMatch: boolean } {
		const password = group.get('oldPassword').value;
		const newPassword = group.get('newPassword').value;
		if (!password || !newPassword) { return; }
		if (password === newPassword) {
			return { passwordMatch: true };
		}
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to validators name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		let control;
		if (controlName) {
			control = this.formGroup.controls[controlName];
		} else {
			control = this.formGroup;
		}

		// console.log(control.errors);

		if (!control) {
			return false;
		}
		// console.log(control);
		const result = control.hasError(validationType) && (control.dirty || control.touched);
		// console.log(result);F
		return result;
	}

	onSubmit() {
		if (this.isLoading === true) {
			return;
		}
		const controls = this.formGroup.controls;
		/** check form */
		if (this.formGroup.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}
		if (this.formGroup.invalid) {
			return;
		}
		this.isLoading = true;
		this.store.dispatch(new ChangePasswordOnServer({ passwordObj: this.createPayload() }));
	}

	onUpdated() {
		const subscribeSuccess = this.store.pipe(select(passwordChangeSuccess)).subscribe(res => {
			if (res) {
				this.layoutUtilsService.showActionNotification(
					this.translateService.instant('VALIDATION.PASSWORD_UPDATE_SUCCESS'),
					MessageType.Update
				);
				this.isLoading = false;
				localStorage.removeItem(environment.authTokenKey);
				this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '' } });
			}
		});
		this.subscriptions.push(subscribeSuccess);
		const subscribeFailed = this.store.pipe(select(passwordChangeFailed)).subscribe(res => {
			if (res) {
				this.layoutUtilsService.showActionNotification(
					res.error.returnMes,
					MessageType.Update
				);
				this.isLoading = false;
			}
		});
		this.subscriptions.push(subscribeFailed);
	}

	createPayload() {
		const passwordChangePayload = JSON.parse(JSON.stringify(this.formGroup.value as ChangePassword));
		passwordChangePayload.username = this.userName ? this.userName : '';
		return passwordChangePayload;
	}
	onReset() {
		this.initChangePasswordForm();
	}

}

