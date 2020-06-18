// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Observable, of, Subscription, Subject } from 'rxjs';
// Lodash
import { each, find, some, isEmpty } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../../../core/reducers';
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
	ServiceModel,
	selectCreateRoleFail,
	selectUpdateRoleSuccess,
	selectUpdateRoleFail,
	selectRolePermissionById,
	RoleByIdLoad,
	AllPermissionsRequested
} from '../../../../../../core/auth';
import { delay } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'kt-role-edit-dialog',
	templateUrl: './role-edit.dialog.component.html',
	styleUrls: ['./role-edit.dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class RoleEditDialogComponent implements OnInit, OnDestroy {
	// Public properties
	role: Role;
	role$: Observable<Role>;
	hasFormErrors = false;
	messageErr: any;
	viewLoading = false;
	loadingAfterSubmit = false;
	allPermissions$: Observable<Permission[]>;
	rolePermissions: Permission[] = [];
	// Private properties
	private componentSubscriptions: Subscription;
	editForm: FormGroup;
	destroy$: Subject<boolean> = new Subject<boolean>();
	isDisable = false;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<RoleEditDialogComponent>,
		// tslint:disable-next-line:align
		@Inject(MAT_DIALOG_DATA) public data: any,
		// tslint:disable-next-line:align
		private store: Store<AppState>,
		// tslint:disable-next-line:align
		private fb: FormBuilder
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.store.dispatch(new AllPermissionsRequested());
		if (this.data.roleId) {
			this.store.dispatch(new RoleByIdLoad({id: this.data.roleId}));
			this.role$ = this.store.pipe(select(selectRolePermissionById));
		} else {
			const newRole = new Role();
			newRole.clear();
			this.role$ = of(newRole);
		}

		this.role$.subscribe(res => {
			if (!res) {
				return;
			}
			this.role = new Role();
			this.role.roleId = res.roleId;
			this.role.roleName = res.roleName;
			this.role.roleDescription = res.roleDescription;
			this.role.permissions = res.permissions;
			this.role.isCoreRole = res.isCoreRole;

			this.createForm();

			this.allPermissions$ = this.store.pipe(select(selectAllPermissions));
			this.loadPermissions();
		});
	}

	/**
 	* Create form
 	*/
	createForm() {
		this.editForm = this.fb.group({
			title: [{ value: this.role.roleName, disabled: this.role.isCoreRole },
				Validators.compose([
					Validators.required,
					Validators.maxLength(50)
				])
				],
			roleDescription: [{ value: this.role.roleDescription, disabled: this.role.isCoreRole },
				Validators.maxLength(200)]
		});

	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	/**
	 * Load permissions
	 */
	loadPermissions() {
		this.allPermissions$.subscribe(allPermissions => {
			if (!allPermissions) {
				return;
			}
			this.rolePermissions = [];
			allPermissions.forEach(permission => {
				let finded = [];
				if (this.role.permissions) {
					finded = this.role.permissions.filter(item => permission.functionId === item.functionId);
				}
				const permissionData = new Permission();
				permissionData.functionId = permission.functionId;
				permissionData.functionName = permission.functionName;
				const listService = [];
				permission.services.forEach(element => {
					const perService = new ServiceModel();
					perService.serviceId = element.serviceId;
					perService.serviceName = element.serviceName;
					if (!isEmpty(finded)) {
						perService.isSelected = finded[0].services.some(items => items.serviceId === element.serviceId);
						if (perService.isSelected) {
							permissionData.isSelected = perService.isSelected;
						}

					}
					listService.push(perService);
				});
				permissionData.services = listService;
				this.rolePermissions.push(permissionData);
			});
		});
	}

	/** ACTIONS */
	/**
	 * Returns permissions ids
	 */
	preparePermissionIds(): Permission[] {
		const result = [];
		this.rolePermissions.forEach(permission => {
			if (permission.isSelected) {
				const permissionItem = new Permission();
				permissionItem.functionId = permission.functionId;
				const serviceList = permission.services.filter(item => item.isSelected === true);
				permissionItem.services = serviceList;
				result.push(permissionItem);
			}
		});
		return result;
	}

	/**
	 * Returns role for save
	 */
	prepareRole(): Role {
		const role = new Role();
		role.roleId = this.role.roleId;
		role.permissions = this.preparePermissionIds();
		// each(this.assignedRoles, (_role: Role) => _user.roles.push(_role.id));
		role.roleName = this.editForm.controls['title'].value;
		role.roleDescription = this.editForm.controls['roleDescription'].value;
		role.isCoreRole = this.role.isCoreRole;
		return role;
	}

	/**
	 * Save data
	 */
	onSubmit() {
		this.isDisable = true;
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		const controls = this.editForm.controls;
		/** check form */
		if (!this.editForm.valid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		const editedRole = this.prepareRole();

		if (editedRole.roleId > 0) {
			this.updateRole(editedRole);
		} else {
			this.createRole(editedRole);
		}
	}

	/**
	 * Update role
	 *
	 * @param roles: Role
	 */
	updateRole(roles: Role) {
		// this.loadingAfterSubmit = true;
		// this.viewLoading = true;
		/* Server loading imitation. Remove this on real code */
		const updateRole: Update<Role> = {
			id: this.role.roleId,
			changes: roles
		};
		this.store.dispatch(new RoleUpdated({
			partialrole: updateRole,
			role: roles
		}));

		this.componentSubscriptions = this.store.pipe(
			select(selectUpdateRoleSuccess)
		).subscribe(res => {
			if (!res) {
				return;
			}
			this.dialogRef.close({
				roles,
				isEdit: true
			});
		});
		this.componentSubscriptions = this.store.pipe(select(selectUpdateRoleFail)).subscribe(err => {
			if (err && err.err && err.err.error) {
				this.hasFormErrors = true;
				this.messageErr = err.err.error.returnMes;
				this.isDisable = false;
			}
		});
	}

	/**
	 * Create role
	 *
	 * @param roles: Role
	 */
	createRole(roles: Role) {
		// this.loadingAfterSubmit = true;
		// this.viewLoading = true;
		this.store.dispatch(new RoleOnServerCreated({ role: roles }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedRoleId)
		).subscribe(res => {
			if (!res) {
				return;
			}

			// this.viewLoading = false;
			this.dialogRef.close({
				roles,
				isEdit: false
			});
		});
		this.componentSubscriptions = this.store.pipe(select(selectCreateRoleFail)).subscribe(err => {
			if (err && err.err && err.err.error) {
				this.hasFormErrors = true;
				this.messageErr = err.err.error.returnMes;
				this.isDisable = false;
			}
		});
	}

	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	/**
	 * Check is selected changes Permission
	 *
	 * @param $event: Event
	 * @param index: numner
	 */
	isSelectedChanged($event, index: number) {
		this.rolePermissions[index].services.map(data => data.isSelected = $event.checked);
	}

	/**
	 * Check is selected changes Service
	 *
	 * @param $event: Event
	 * @param indexPermission: number
	 */

	isSelectedChangedService($event, indexPermission: number) {
		if ($event.checked) {
			this.rolePermissions[indexPermission].isSelected = $event.checked;
		} else {
			const finded = this.rolePermissions[indexPermission].services.some(item => item.isSelected === true);
			if (!finded) {
				this.rolePermissions[indexPermission].isSelected = false;
			}
		}
	}

	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.role && this.role.roleId) {
			// tslint:disable-next-line:no-string-throw
			return `Sửa quyền '${this.role.roleName}'`;
		}

		// tslint:disable-next-line:no-string-throw
		return 'Thêm mới';
	}

	/**
	 * Returns is title valid
	 */
	// isTitleValid(): boolean {
	// 	return (this.role && this.role.title && this.role.title.length > 0);
	// }

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to validators name
	 */
		isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.editForm.controls[controlName];
		if (!control) {
			return false;
		}
		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
