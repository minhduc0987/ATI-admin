// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, AfterContentInit } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// NGRX
import { Store, select } from '@ngrx/store';
// Services
import { LayoutUtilsService } from '../../../../../../core/_base/crud';
// Models
import { Role, RolesDataSource, RoleDeleted, RolesPageRequested, selectDeleteRoleSuccess, selectDeleteRoleFail } from '../../../../../../core/auth';
import { AppState } from '../../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../../core/_base/crud';

// Components
import { RoleEditDialogComponent } from '../role-edit/role-edit.dialog.component';
import { RoleUsersDialogComponent } from '../role-users/role-users.dialog.component';

// Share
import { MessageType } from '../../../../../../shared';

// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	selector: 'kt-roles-list',
	templateUrl: './roles-list.component.html',
	styleUrls: ['./roles-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesListComponent implements OnInit, OnDestroy, AfterContentInit {
	// Table fields
	dataSource: RolesDataSource;
	displayedColumns = ['roleId', 'roleName', 'description', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	// Filter fields
	searchInput = '';
	// Selection
	// selection = new SelectionModel<Role>(true, []);
	rolesResult: Role[] = [];
	pageCompare;

	// Subscriptions
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 * @param dialog: MatDialog
	 * @param snackBar: MatSnackBar
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private store: Store<AppState>,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.pageCompare = 10;
		const sortSubscription = this.paginator.page.subscribe((res) => {
			this.loadRolesList();
		});
		this.subscriptions.push(sortSubscription);

		// Init DataSource
		this.dataSource = new RolesDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.rolesResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		// First load
		this.loadRolesList();
	}

	ngAfterContentInit() {
		this.pageCompare = 10;
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load Roles List
	 */
	loadRolesList() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.pageCompare = this.paginator.pageSize;
		// Call request from server
		this.store.dispatch(new RolesPageRequested({ page: queryParams }));
	}

	/**
	 * on Search
	 */
	onSearch() {
		this.paginator.pageIndex = 0;
		this.loadRolesList();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput;
		filter.keyword = searchText;
		return filter;
	}

	/**
	 * Returns object for filter
	 */
	clearPagination(): any {
		this.searchInput = '';
		this.paginator.pageIndex = 0;
	}

	/** ACTIONS */
	/**
	 * Delete role
	 *
	 * @param item: Role
	 */
	deleteRole(item: Role) {
		const title = `${this.translate.instant('DELETE_ROLE.TITLE')}`;
		const description = `${this.translate.instant('DELETE_ROLE.CONTENT')}`;
		const waitDesciption = `${this.translate.instant('TABLE.WAIT')}`;
		const deleteMessage = `${this.translate.instant('MESSAGE.DELETE_SUCCESS')}`;

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const listRole = [];
			listRole.push(item.roleId);
			const roleDelete = {
				roleIds: listRole,
				status: 'D'
			};
			this.store.dispatch(new RoleDeleted({ roles: roleDelete }));
			const deleteSubcription = this.store.pipe(select(selectDeleteRoleSuccess)).subscribe(response => {
				if (response) {
					this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadRolesList();
				}
			});
			this.subscriptions.push(deleteSubcription);
			const deleteErrSubcription = this.store.pipe(select(selectDeleteRoleFail)).subscribe(err => {
				if (err && err.err && err.err.error) {
					const messageErr = err.err.error.returnMes;
					this.layoutUtilsService.showActionNotification(messageErr, MessageType.Delete);
				}
			});
			this.subscriptions.push(deleteErrSubcription);
		});
	}

	/**
	 * Add role
	 */
	addRole() {
		const newRole = new Role();
		newRole.clear(); // Set all defaults fields
		this.editRole(newRole);
	}

	/**
	 * Edit role
	 *
	 * @param role: Role
	 */
	editRole(role: Role) {
		const saveMessage = `${this.translate.instant('MESSAGE.SUCCESS')}`;
		const messageType = role.roleId ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(RoleEditDialogComponent, { data: { roleId: role.roleId } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(saveMessage, messageType, 10000);
			this.clearPagination();
			this.loadRolesList();
		});
	}

	/**
	 * role Users
	 *
	 * @param role: Role
	 */
	roleUsers(role: Role) {
		const dialogRef = this.dialog.open(RoleUsersDialogComponent, { data: { roleId: role.roleId }, disableClose: true });
	}

	/**
	 * page event
	 */
	pageEvent(page) {
		if (this.pageCompare !== page.pageSize) {
			this.paginator.pageIndex = 0;
		} else {
			this.paginator.pageIndex = page.pageIndex;
		}
		this.loadRolesList();
	}


}
