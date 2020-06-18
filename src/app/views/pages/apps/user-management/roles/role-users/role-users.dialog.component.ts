// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort } from '@angular/material';
// RxJS
import { Observable, of, Subscription, merge } from 'rxjs';
// Lodash
import { each, find, some } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State

// Services and Models
import {
	Role,
	Permission,
	selectRoleById,
	RoleUpdated,
	selectAllPermissions,
	selectAllRoles,
	selectLastCreatedRoleId,
	RoleOnServerCreated,
	UsersDataSource,
	User,
	UsersPageRequested,
	RoleUsersList,
	selectUsersRole,
	UsersList,
	selectUsersList,
	selectUsersRoleUpdate,
	UsersRoleUpdate,
	QueryParamsRoleModel,
	selectUsersRoleUpdateFail,
	RoleUsersCheckUpdate,
	SelectRoleUsersCheckSuccess,
	SelectRoleUsersCheckFail,
} from '../../../../../../core/auth';
import { delay, tap, skip, distinctUntilChanged, take } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { AppState } from '../../../../../../core/reducers';
import { QueryParamsModel, LayoutUtilsService } from '../../../../../../core/_base/crud';
// Lodash
import { isEmpty } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'kt-role-users-dialog',
	templateUrl: './role-users.dialog.component.html',
	styleUrls: ['./role-users.dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class RoleUsersDialogComponent implements OnInit, OnDestroy {
	users: User[] = [];
	usersChecked: User[] = [];
	usersRole: User[] = [];
	usersRoleChecked: User[] = [];
	role: Role;
	role$: Observable<Role>;
	searchUser = '';
	searchUserRole = '';
	pageIndex = 0;
	pageSize = 10;
	pageIndexUserRole = 0;
	pageSizeUserRole = 10;
	userRoled;
	totalUsersRole: number;
	totalUsers: number;
	messageUncheckUser = '';
	messagecheckUser = '';
	hasUnCheckUsersErrors = false;
	hasCheckUsersErrors = false;
	isDisableCheck = false;
	isDisableUncheck = false;
	private componentSubscriptions: Subscription;
	@ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
	// Subscriptions
	private subscriptions: Subscription[] = [];
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 * @param translate: any
	 * @param layoutUtilsService: Store<AppState>
	 */
	constructor(
		public dialogRef: MatDialogRef<RoleUsersDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		if (this.data.roleId) {
			this.role$ = this.store.pipe(select(selectRoleById(this.data.roleId)));
		}

		this.role$.subscribe(res => {
			if (!res) {
				return;
			}

			this.role = new Role();
			this.role.roleId = res.roleId;
			this.role.roleName = res.roleName;
		});


		// First Load
		this.loadUsersList();
		this.loadUserRole();
		this.store.pipe(select(selectUsersRole)).subscribe(res => {
			if (!isEmpty(res)) {
				this.usersRole = res.users.items;
				this.totalUsersRole = res.users.totalCount;
			}
		});

		this.store.pipe(select(selectUsersList)).subscribe(res => {
			if (!isEmpty(res)) {
				this.users = res.users.items;
				this.totalUsers = res.users.totalCount;
			}
		});
	}

	/**
	 * Load users list
	 */
	loadUsersList() {
		this.usersChecked = [];
		const queryParams = new QueryParamsRoleModel(
			this.filterConfiguration(this.searchUser),
			this.pageIndex,
			this.pageSize,
			'UNCHECKED',
			this.data.roleId
		);
		this.store.dispatch(new UsersList({ pagination: queryParams }));
	}

	/**
	 * Load users role
	 */
	loadUserRole() {
		this.usersRoleChecked = [];
		const queryParams = new QueryParamsRoleModel(
			this.filterConfiguration(this.searchUserRole),
			this.pageIndexUserRole,
			this.pageSizeUserRole,
			'CHECKED',
			this.data.roleId
		);
		this.store.dispatch(new RoleUsersList({ pagination: queryParams }));
	}


	/** FILTRATION */
	filterConfiguration(searchUser): any {
		const filter: any = {};
		const searchText: string = searchUser;
		filter.keyword = searchText;
		return filter;
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}


	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.role && this.role.roleId) {
			// tslint:disable-next-line:no-string-throw
			return `Phân quyền '${this.role.roleName}'`;
		}
	}

	/**
	 * load Page
	 *
	 * @param page: number
	 */
	pageEvent(page) {
		this.pageIndex = page.pageIndex;
		this.pageSize = page.pageSize;
		this.loadUsersList();
	}

	/**
	 * load Page user role
	 *
	 * @param page: number
	 */
	pageEventUserRole(page) {
		this.pageIndexUserRole = page.pageIndex;
		this.pageSizeUserRole = page.pageSize;
		this.loadUserRole();
	}

	/**
	 * is check user
	 *
	 * @param item: User
	 */
	ischeckUser(item: User) {
		return this.usersChecked.some(user => user.userId === item.userId);
	}

	/**
	 * is check user role
	 *
	 * @param item: User
	 */
	ischeckUserRole(item: User) {
		return this.usersRoleChecked.some(user => user.userId === item.userId);
	}

	/**
	 * is select user
	 *
	 * @param item: User
	 * @param event: any
	 */
	isSelectedUser(item: User, event) {
		if (event.checked) {
			this.usersChecked.push(item);
		} else {
			const index = this.usersChecked.findIndex(user => user.userId === item.userId);
			if (index > -1) {
				this.usersChecked.splice(index, 1);
			}
		}
	}

	/**
	 * is select user role
	 *
	 * @param item: User
	 * @param event: any
	 */
	isSelectedUserRole(item: User, event) {
		if (event.checked) {
			this.usersRoleChecked.push(item);
		} else {
			const index = this.usersRoleChecked.findIndex(user => user.userId === item.userId);
			if (index > -1) {
				this.usersRoleChecked.splice(index, 1);
			}
		}
	}

	/**
	 * is check all user
	 */
	isCheckAllUser() {
		if (!isEmpty(this.usersChecked) && !isEmpty(this.users)) {
			return this.usersChecked.length === this.users.length;
		}
		return false;
	}

	/**
	 * is check all user role
	 */
	isCheckAllUserRole() {
		if (!isEmpty(this.usersRoleChecked) && !isEmpty(this.usersRole)) {
			return this.usersRoleChecked.length === this.usersRole.length;
		}
		return false;
	}

	/**
	 * is check all user
	 *
	 * @param event: any
	 */
	isSelectAllUsers(event) {
		if (event.checked) {
			this.usersChecked = [];
			this.users.forEach(item => {
				this.usersChecked.push(item);
			});
		} else {
			this.usersChecked = [];
		}
	}

	/**
	 * is select all user role
	 *
	 * @param event: any
	 */
	isSelectAllUsersRole(event) {
		if (event.checked) {
			this.usersRoleChecked = [];
			this.usersRole.forEach(item => {
				this.usersRoleChecked.push(item);
			});
		} else {
			this.usersRoleChecked = [];
		}
	}

	/**
	 * on save user check
	 *
	 */
	onSaveUserCheck() {
		this.isDisableCheck = true;
		this.hasCheckUsersErrors = false;
		const saveMessage = `${this.translate.instant('MESSAGE.SUCCESS')}`;
		const userRoleUpdate = this.prepareRole(this.usersChecked);
		this.store.dispatch(new RoleUsersCheckUpdate({ userRole: userRoleUpdate }));
		this.store.pipe(select(SelectRoleUsersCheckSuccess)).subscribe(res => {
			if (res) {
				console.log('res check', res);
				this.isDisableCheck = false;
				this.resetUsersRole();
				this.layoutUtilsService.showActionNotification(saveMessage, 10000);
			}
		});
		this.store.pipe(select(SelectRoleUsersCheckFail)).subscribe(err => {
			if (err && err.err && err.err.error) {
				this.hasCheckUsersErrors = true;
				this.messagecheckUser = err.err.error.returnMes;
			}
		});
	}

	/**
	 * on save user uncheck
	 *
	 */
	onSaveUserUnCheck() {
		this.isDisableUncheck = true;
		const saveMessage = `${this.translate.instant('MESSAGE.SUCCESS')}`;
		const userRoleUpdate = this.prepareRole(this.usersRoleChecked);
		this.store.dispatch(new UsersRoleUpdate({ userRole: userRoleUpdate }));
		this.store.pipe(select(selectUsersRoleUpdate)).subscribe(res => {
			if (res) {
				this.isDisableUncheck = false;
				this.resetUsersRole();
				this.layoutUtilsService.showActionNotification(saveMessage, 10000);
			}
		});
		this.store.pipe(select(selectUsersRoleUpdateFail)).subscribe(err => {
			if (err && err.err && err.err.error) {
				this.hasUnCheckUsersErrors = true;
				this.messageUncheckUser = err.err.error.returnMes;
			}
		});
	}

	/**
	 * reset users role
	 *
	 */
	resetUsersRole() {
		this.paginator.first.pageIndex = 0;
		this.paginator.last.pageIndex = 0;
		this.usersChecked = [];
		this.usersRoleChecked = [];
		this.pageIndex = 0;
		this.pageIndexUserRole = 0;
		this.searchUser = '';
		this.searchUserRole = '';
	}

	/**
	 * Returns role for save
	 * @param usersRole: Role
	 */
	prepareRole(usersRole): Role {
		const role = new Role();
		role.roleId = this.role.roleId;
		role.roleUsers = [];
		usersRole.forEach(item => {
			role.roleUsers.push(item.userId);
		});
		return role;
	}

	/**
	 * is disabale user
	 *
	 */
	isDisableUser() {
		return this.usersChecked.length <= 0;
	}

	/**
	 * is disabale user role
	 *
	 */
	isDisableUserRole() {
		return this.usersRoleChecked.length <= 0;
	}

	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasUnCheckUsersErrors = false;
	}

	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertCloseCheck($event) {
		this.hasCheckUsersErrors = false;
	}
}
