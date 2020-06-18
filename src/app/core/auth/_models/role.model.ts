import { BaseModel } from '../../_base/crud';
import { Permission } from './permission.model';

export class Role extends BaseModel {
	roleId: number;
	roleName: string;
	roleDescription: string;
	permissions: Permission[];
	isCoreRole: boolean;
	roleUsers: number[];

	clear(): void {
		this.roleId = undefined;
		this.roleName = '';
		this.roleDescription = '';
		this.permissions = [];
		this.isCoreRole = false;
	}
}

export class QueryParamsRoleModel {
	filter: any;
	pageNumber: number;
	pageSize: number;
	roleCheck: string;
	roleId: number;
	constructor(
		filter: any,
		pageNumber: number = 0,
		pageSize: number = 10,
		roleCheck: string = '',
		roleId: number = 0) {
		this.filter = filter;
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		this.roleCheck = roleCheck;
		this.roleId = roleId;
	}
}
