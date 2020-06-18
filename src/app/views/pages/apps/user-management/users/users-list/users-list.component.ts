import { AfterViewInit, AfterViewChecked, ViewEncapsulation } from '@angular/core';
// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog, PageEvent } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription, from, Subject } from 'rxjs';
// LODASH
import { each, find } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../../core/reducers';

// Services
import { LayoutUtilsService, QueryParamsModel } from '../../../../../../core/_base/crud';
// Models
import {
	User,
	DeleteUser,
	UsersDataSource,
	ManyUsersDeleted,
	UserDeleted,
	UsersPageRequested,
	UserUpdated,
	selectUserById,
	selectDeleteError,
	selectDeleteSuccess,
} from '../../../../../../core/auth';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { TranslateService } from '@ngx-translate/core';
import { StatusCode } from '../../../../../../shared/enum/status.enum';
import { UserType } from '../../../../../../shared/enum/user-type.enum';
import { MessageType } from '../../../../../../shared';

// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
// tslint:disable: variable-name
@Component({
	selector: 'kt-users-list',
	styleUrls: ['./users-list.component.scss'],
	templateUrl: './users-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class UsersListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: UsersDataSource;
	displayedColumns = ['select', 'stt', 'username', 'fullname', 'email', 'usertype', 'status', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	searchInput = '';
	userStatus = [];
	userType = [];
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<User>(true, []);
	usersResult: User[] = [];
	isDisable = true;
	roles = [];
	settingStatus = {};
	settingUserType = {};
	statusAll = [];
	userTypeAll = [];
	pageNow;
	// Subscriptions
	private subscriptions: Subscription[] = [];
	/**
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param router: Router
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private cdr: ChangeDetectorRef,
		private translate: TranslateService,
		public dialog: MatDialog,
	) {}
	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.pageNow = 10;
		// If the user changes the sort order, reset back to the first page.
		const sortSubscription = this.paginator.page.subscribe(() => {
			this.loadUsersList();
		});
		this.subscriptions.push(sortSubscription);
		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.paginator.page)
			.pipe(
				tap(() => {
					this.loadUsersList();
				}),
			)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);
		// Init DataSource
		this.dataSource = new UsersDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(skip(1), distinctUntilChanged()).subscribe((res) => {
			this.usersResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First Load
		this.loadUsersList();
		/**
		 * Angular 2 multiselect
		 */
		this.settingStatus = {
			singleSelection: true,
			lazyLoading: false,
			showCheckbox: true,
			classes: 'delete-icon-remove',
			labelKey: 'status',
		};
		this.userStatus = [{ id: 'ALL', status: 'Tất cả' }];
		this.userType = [{ id: 'ALL', userType: 'Tất cả' }];
		this.settingUserType = {
			singleSelection: true,
			lazyLoading: false,
			showCheckbox: true,
			classes: 'delete-icon-remove',
			labelKey: 'userType',
		};
		Object.entries(StatusCode).forEach(([key, value]) => {
			const temp = { id: key, status: this.translate.instant(value) };
			this.statusAll.push(temp);
		});
		Object.entries(UserType).forEach(([key, value]) => {
			const tempp = { id: key, userType: this.translate.instant(value) };
			this.userTypeAll.push(tempp);
		});
	}
	// tslint:disable-next-line: use-life-cycle-interface
	ngAfterContentInit() {
		this.pageNow = 10;
	}
	/**
	 * load Page
	 *
	 * @param page: number
	 */
	pageEvent(page) {
		if (this.pageNow !== page.pageSize) {
			this.paginator.pageIndex = 0;
		} else {
			this.paginator.pageIndex = page.pageIndex;
		}
		this.loadUsersList();
	}
	/**
	 * ngOnDestroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach((el) => el.unsubscribe());
	}
	/**
	 * Load users list
	 */
	loadUsersList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(this.filterConfiguration(), this.paginator.pageIndex, this.paginator.pageSize);
		this.pageNow = this.paginator.pageSize;
		this.store.dispatch(new UsersPageRequested({ page: queryParams }));
	}
	/**
	 * Search
	 */
	search() {
		this.paginator.pageIndex = 0;
		this.loadUsersList();
	}
	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput;
		if (this.userStatus && this.userStatus.length > 0 && this.userStatus[0].id !== 'ALL') {
			filter.status = this.userStatus[0].id;
		}
		if (this.userType && this.userType.length > 0 && this.userType[0].id !== 'ALL') {
			if (this.userType[0].id === 'ALL') {
				filter.userType = '';
			} else {
				filter.userType = this.userType[0].id;
			}
		}
		filter.keyword = searchText;
		return filter;
	}
	/** ACTIONS */
	/**
	 * Delete user
	 *
	 * @param _item: User
	 */
	deleteUser(_item: User) {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM', {
			action: `${this.translate.instant('ACTION.DELETE')}`,
			name: `${this.translate.instant('USERS.USER')}`.toLowerCase(),
		});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM', {
			action: `${this.translate.instant('ACTION.DELETE')}`.toLowerCase(),
			name: `${this.translate.instant('USERS.USER')}`.toLowerCase(),
		});
		const _waitDesciption = this.translate.instant('TABLE.WAIT');
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			const statusUser = new DeleteUser();
			statusUser.clear();
			statusUser.userIdList.push(_item.userId);
			statusUser.status = 'D';
			this.store.dispatch(new UserDeleted({ id: statusUser }));
			// tslint:disable: no-shadowed-variable
			this.store.pipe(select(selectDeleteError)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.store.pipe(select(selectDeleteSuccess)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.DELETE_SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadUsersList();
				}
			});
		});
	}
	/**
	 * Delete selected customers
	 */
	deleteUsers() {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM', {
			action: `${this.translate.instant('ACTION.DELETE')}`,
			name: `${this.translate.instant('USERS.USER')}`.toLowerCase(),
		});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM', {
			action: `${this.translate.instant('ACTION.DELETE')}`.toLowerCase(),
			name: `${this.translate.instant('USERS.USER')}`.toLowerCase(),
		});
		const _waitDesciption = this.translate.instant('TABLE.WAIT');
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			const statusUser = new DeleteUser();
			statusUser.clear();
			this.selection.selected.forEach((data) => {
				statusUser.userIdList.push(data.userId);
			});
			statusUser.status = 'D';
			this.store.dispatch(new UserDeleted({ id: statusUser }));
			this.store.pipe(select(selectDeleteError)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.store.pipe(select(selectDeleteSuccess)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.DELETE_SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadUsersList();
				}
			});
		});
	}
	clearPagination(): any {
		this.searchInput = '';
		this.paginator.pageIndex = 0;
	}
	resetPassword(_item: User) {}
	/**
	 * Check all rows are selected
	 */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.usersResult.length;
		return numSelected === numRows;
	}
	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.usersResult.length) {
			this.selection.clear();
		} else {
			this.usersResult.forEach((row) => this.selection.select(row));
		}
	}
	/**
	 * Redirect to edit page
	 *
	 */
	editUser(userId) {
		let saveMessageTranslateParam = 'MESSAGE.';
		saveMessageTranslateParam += userId > 0 ? 'SUCCESS' : 'SUCCESS';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = userId > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(UserEditComponent, {
			data: { userId },
			disableClose: true,
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			this.clearPagination();
			this.loadUsersList();
			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		});
	}
	/**
	 * add User
	 */
	addUser() {
		const newUser = new User();
		newUser.clear(); // Set all defaults fields
		this.editUser(newUser);
	}
	/**
	 * Retursn CSS Class Name by status
	 *
	 * @param status: number
	 */
	getItemCssClassByStatus(status: string) {
		switch (status) {
			case 'I':
				return 'danger';
			case 'A':
				return 'success';
		}
		return '';
	}
	getItemCssClassByType(status: string) {
		switch (status) {
			case 'USER':
				return 'black';
			case 'ADMIN':
				return 'red';
		}
		return '';
	}
	/**
	 * Returns Item Status in string
	 * @param status: number
	 */
	getItemStatusString(status: string) {
		switch (status) {
			case 'I':
				return `${this.translate.instant('STATUS_OPTIONS.I')}`;
			case 'A':
				return `${this.translate.instant('STATUS_OPTIONS.A')}`;
		}
		return `${this.translate.instant('STATUS_OPTIONS.PENDING')}`;
	}
	getItemTypeString(userType: string) {
		switch (userType) {
			case 'USER':
				return `${this.translate.instant('USER.USER_TYPE.USER')}`;
			case 'ADMIN':
				return `${this.translate.instant('USER.USER_TYPE.ADMIN')}`;
		}
		return `${this.translate.instant('USER.USER_TYPE.PENDING')}`;
	}
}
