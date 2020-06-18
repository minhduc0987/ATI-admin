import { BaseModel } from '../../_base/crud';
import { Role } from './role.model';
import { ReferenceLink } from '../../apps';

export class User extends BaseModel {
	id: number;
	userId: number;
	username: string;
	password: string;
	email: string;
	accessToken: string;
	roles: Role[];
	roleIds: number[];
	fullname: string;
	status: string;
	userType: string;
	about: string;
	addressLine: string;
	company: string;
	dob: string;
	gender: string;
	identityNumber: string;
	identityType: string;
	phone: string;
	pic: string;
	position: string;
	referenceLinks: ReferenceLink[];
	representative: string;
	wardId: number;
	wardNane: string;
	districtId: number;
	districtName: string;
	provinceId: number;
	provinceName: string;
	zipCode: string;


	clear(): void {
		this.userId = undefined;
		this.username = '';
		this.email = '';
		this.roles = [];
		this.roleIds = [];
		this.fullname = '';
		this.accessToken = 'access-token-' + Math.random();
		this.about = '';
		this.addressLine = '';
		this.company = '';
		this.dob = '';
		this.gender = '';
		this.identityNumber = '';
		this.identityType = '';
		this.phone = '';
		this.pic = '';
		this.position = '';
		this.referenceLinks = undefined;
		this.representative = '';
		this.status = '';
		this.userType = '';
		this.wardId = undefined;
		this.zipCode = '';
	}
}

export class DeleteUser extends BaseModel {
	userIdList: number[];
	status: string;

	clear(): void {
		this.userIdList = [];
		this.status = '';
	}
}
