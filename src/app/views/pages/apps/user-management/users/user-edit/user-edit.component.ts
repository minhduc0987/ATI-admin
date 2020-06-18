// Angular
import { Component, OnInit, OnDestroy, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	FormBuilder,
	FormGroup,
	Validators,
	FormControl
} from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription, Subject } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../../../core/reducers';
// Layout
import { LayoutConfigService } from '../../../../../../core/_base/layout';
import {
	LayoutUtilsService,
	QueryParamsModel
} from '../../../../../../core/_base/crud';
// CRUD
import { TypesUtilsService } from '../../../../../../core/_base/crud';
import { MessageType } from '../../../../../../shared';

// Services and Models
import {
	User,
	UserUpdated,
	selectUserById,
	UserOnServerCreated,
	selectLastCreatedUserId,
	Role,
	selectAllRoles,
	selectSucessCreateUser,
	RolesDataSource,
	RolesPageRequested,
	selectErrorCreateUser,
	selectUpdateSuccess,
	selectUpdateError,
} from '../../../../../../core/auth';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { each, find, remove } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { skip, distinctUntilChanged } from 'rxjs/operators';
import { Item } from 'angular2-multiselect-dropdown';

// tslint:disable: variable-name
@Component({
	selector: 'kt-user-edit',
	styleUrls: ['./user-edit.component.scss'],
	templateUrl: './user-edit.component.html',
	encapsulation: ViewEncapsulation.None
})
export class UserEditComponent implements OnInit, OnDestroy {
	// Public properties
	user: User;
	userId$: Observable<number>;
	loading$: Observable<boolean>;
	viewLoading = false;
	userForm: FormGroup;
	hasFormError = false;
	hasErrors = false;
	dropdownList = [];
	selectedItems = [];
	settings = {};
	allRoles: Role[] = [];
	allUserRoles$: Observable<Role[]>;
	private subscriptions: Subscription[] = [];
	private componentSubscriptions: Subscription;
	isDisable = false;
	isDisableRole = false;
	isDisableFullname = false;
	rolesResult: Role[] = [];
	dataSource: RolesDataSource;
	messErr = '';
	userRoles = [];
	regEmail = '^[a-z][a-z0-9_\.]{2,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$';
	regUserName = '^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$';
	regExFullname = '^[a-zA-Z_\'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$';
	isDisableSave = false;
	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param userFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(
		public dialogRef: MatDialogRef<UserEditComponent>,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		private translate: TranslateService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }
	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		if (this.data.userId && this.data.userId > 0) {
			this.store
				.pipe(select(selectUserById(this.data.userId)))
				.subscribe(res => {
					if (res) {
						this.isDisable = true;
						this.user = res;
						if (this.user.userType === 'USER') {
							this.isDisableRole = true;
							this.isDisableFullname = true;
						} else {
							this.isDisableRole = false;
							this.isDisableFullname = false;
							this.loadRolesList();
						}
						this.createForm();
					}
				});
		} else {
			this.isDisable = false;
			this.user = new User();
			this.user.status = 'A';
			this.user.userType = 'ADMIN';
			this.isDisableRole = false;
			this.isDisableFullname = false;
			this.user.clear();
			this.createForm();
		}
		this.allUserRoles$ = this.store.pipe(select(selectAllRoles));
		this.allUserRoles$.subscribe((res: Role[]) => {
			this.allRoles = [];
			each(res, (_role: Role) => {
				const roleAll: any = { roleId: _role.roleId, roleName: _role.roleName };
				this.allRoles.push(roleAll);
			});
		});
		/**
		 * Angular 2 multiselect
		 */
		this.settings = {
			singleSelection: false,
			labelKey: 'roleName',
			primaryKey: 'roleId',
			text: this.translate.instant('USERS.SELECTROLE'),
			enableFilterSelectAll: false,
			enableCheckAll: false,
			enableSearchFilter: true,
			maxHeight: 190,
			lazyLoading: false,
			showCheckbox: true,
		};
		// Init DataSource
		this.dataSource = new RolesDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
			).subscribe(res => {
				this.rolesResult = res;
			});
		this.subscriptions.push(entitiesSubscription);
	}
	/*** ngOnDestroy*/
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}
	onSelect(item: any) {
		this.userRoles = this.userRoles.concat(item);
		const data = new Set(this.userRoles);
		this.userRoles = Array.from(data);
	}
	onDeSelectAll(items: any) {
		this.userRoles = [];
	}
	loadRolesList() {
		// tslint:disable: quotemark
		// tslint:disable: object-literal-key-quotes
		const filter: any = {
			"filter": {
				"keyword": "",
				"status": ""
			},
			"pageNumber": 0,
			"pageSize": 100
		};
		// Call request from server
		this.store.dispatch(new RolesPageRequested({ page: filter }));
	}

	/**
	 * Create FORM
	 */
	createForm() {
		this.userRoles = [];
		this.user.roles.forEach(data => {
			this.userRoles.push(Object.assign({}, data));
		});
		this.userForm = this.userFB.group({
			username: [
				{ value: this.user.username, disabled: this.isDisable },
				Validators.compose([
					Validators.required,
					Validators.pattern(this.regUserName)
				])
			],
			fullname: [{ value: this.user.fullname, disabled: this.isDisableFullname },
			Validators.compose([
				Validators.required,
				Validators.maxLength(50),
				Validators.pattern(this.regExFullname)
			])
			],
			email: [
				{ value: this.user.email, disabled: this.isDisable },
				Validators.compose([
					Validators.required,
					Validators.pattern(this.regEmail)
				])
			],
			userType: [{ value: this.user.userType, disabled: !this.isDisable }, Validators.required],
			status: [{ value: this.user.status, disabled: !this.isDisable }, Validators.required],
			userRoles: [this.userRoles]
		});
	}
	/**
	 * Get title
	 */
	getTitle(): string {
		if (this.user.userId > 0) {
			if (this.user.userType === 'U') {
				return `${this.translate.instant('USERS.TITLE_USER',
				{ action: `${this.translate.instant('ACTION.EDIT')}`})} : '${this.user.username}'`;
			}
			return `${this.translate.instant('USERS.TITLE_USER',
			{ action: `${this.translate.instant('ACTION.EDIT')}`})}: '${this.user.username}' -
			${this.translate.instant(`USER.USER_TYPE.${this.user.userType}`)}`;
		}
		return `${this.translate.instant('USERS.TITLE_USER', { action: `${this.translate.instant('BUTTON.ADD')}` } )}`;
	}
	/**
	 * On Submit
	 */
	onSubmit() {
		this.isDisableSave = true;
		this.hasFormError = false;
		const controls = this.userForm.controls;
		/** check form */
		if (this.userForm.invalid) {
			this.hasFormError = true;
			this.hasErrors = true;
			this.messErr = `${this.translate.instant('MESSAGE.ERROR')}`;
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}
		const editedUser = this.prepareUser();
		if (editedUser.userId > 0) {
			this.updateUser(editedUser);
		} else {
			this.createUser(editedUser);
		}
	}
	/**
	 * Prepare User
	 */
	prepareUser(): User {
		const controls = this.userForm.controls;
		const _user = new User();
		_user.userId = this.user.userId;
		_user.username = controls['username'].value;
		_user.fullname = controls['fullname'].value;
		_user.email = controls['email'].value;
		_user.status = controls['status'].value;
		_user.roleIds = [];
		this.userRoles.forEach(item => {
			_user.roleIds.push(item.roleId);
		});
		return _user;
	}
	/**
	 * Update User
	 *
	 * @param _user: UserModel
	 */
	updateUser(_user: User, withBack: boolean = false) {
		const updateUser: Update<User> = {
			id: _user.userId,
			changes: _user
		};
		this.store.dispatch(new UserUpdated({ partialUser: updateUser, user: _user }));
		this.store.pipe(select(selectUpdateSuccess)).subscribe(res => {
			if (res) {
				this.hasErrors = false;
				this.dialogRef.close({ _user, isEdit: true });
			}
		});
		this.store.pipe(select(selectUpdateError)).subscribe(err => {
			if (err && err.err && err.err.error) {
				this.hasErrors = true;
				this.messErr = err.err.error.returnMes;
				this.isDisableSave = false;
			}
			// if (err && err.err) {
			// 	this.messErr = '';
			// 	this.hasErrors = true;
			// 	if (err.err.error) {
			// 		if (err.err.error.validationMessage) {
			// 			const errss = err.err.error.validationMessage;
			// 			if (errss.email) {
			// 				this.messErr += errss.email + ' ';
			// 			}
			// 			if (errss.username) {
			// 				this.messErr += errss.username + ' ';
			// 			}
			// 			if (errss.fullname) {
			// 				this.messErr += errss.fullname + ' ';
			// 			}
			// 		} else {
			// 			this.messErr += err.err.error.returnMes;
			// 		}
			// 	}
			// } else {
			// 	this.messErr = `${this.translate.instant('MESSAGE.ERROR')}`;
			// }
		});
	}
	/**
	 * Create User
	 *
	 * @param _user: User
	 */
	createUser(_user: User) {
		this.store.dispatch(new UserOnServerCreated({ user: _user }));
		this.componentSubscriptions = this.store
			.pipe(select(selectLastCreatedUserId))
			.subscribe(res => {
				if (!res) {
					return;
				}
				this.dialogRef.close({ _user, isEdit: false });
			});
		this.store.pipe(select(selectSucessCreateUser)).subscribe(res => {
			if (res) {
				this.hasErrors = false;
				this.dialogRef.close({ _user, isEdit: false });
			}
		});

		this.store.pipe(select(selectErrorCreateUser)).subscribe(err => {
			if (err && err.err && err.err.error) {
				this.hasErrors = true;
				this.messErr = err.err.error.returnMes;
				this.isDisableSave = false;
			}
			// if (err && err.err) {
			// 	this.messErr = '';
			// 	this.hasErrors = true;
			// 	if (err.err.error) {
			// 		if (err.err.error.validationMessage) {
			// 			const errss = err.err.error.validationMessage;
			// 			if (errss.email) {
			// 				this.messErr += errss.email + ' ';
			// 			}
			// 			if (errss.username) {
			// 				this.messErr += errss.username + ' ';
			// 			}
			// 			if (errss.fullname) {
			// 				this.messErr += errss.fullname + ' ';
			// 			}
			// 		} else {
			// 			this.messErr += err.err.error.returnMes;
			// 		}
			// 	}
			// } else {
			// 	this.messErr = `${this.translate.instant('MESSAGE.ERROR')}`;
			// }
		});
	}
	/**
	 * Go back
	 */
	goBackWithId() {
		const url = `/users`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormError = false;
	}
	/**
	 * Returns Item Status in string
	 * @param status: number
	 */
	getItemStatusString(status: string): string {
		switch (status) {
			case 'I':
				return `${this.translate.instant('STATUS_OPTIONS.I')}`;
			case 'A':
				return `${this.translate.instant('STATUS_OPTIONS.A')}`;
		}
		return `${this.translate.instant('STATUS_OPTIONS.PENDING')}`;
	}
	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to validators name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.userForm.controls[controlName];
		if (!control) {
			return false;
		}
		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
		return result;
	}
}
