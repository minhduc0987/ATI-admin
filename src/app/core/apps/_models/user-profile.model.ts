import { Role } from '../../auth';

export class UserProfile {
	about: string;
	addressLine: string;
	company: string;
	dob: string;
	email: string;
	fullname: string;
	gender: string;
	identityNumber: string;
	identityType: string;
	phone: string;
	pic: string;
	position: string;
	referenceLinks: ReferenceLink[];
	representative: string;
	status: string;
	userId: number;
	userType: string;
	wardId: number;
	wardNane: string;
	districtId: number;
	districtName: string;
	provinceId: number;
	provinceName: string;
	zipCode: string;
	username: string;
	roles: Role[];
	lastLogin: string;

	clear(): void {
		this.about = '';
		this.addressLine = '';
		this.company = '';
		this.dob = '';
		this.email = '';
		this.fullname = '';
		this.gender = '';
		this.identityNumber = '';
		this.identityType = '';
		this.phone = '';
		this.pic = '';
		this.position = '';
		this.referenceLinks = undefined;
		this.representative = '';
		this.status = '';
		this.userId = undefined;
		this.userType = '';
		this.wardId = undefined;
		this.zipCode = '';
		this.username = '';
	}
}
export class ReferenceLink {
	link: string;
	type: string;

	clear() {
		this.link = '';
		this.type = '';
	}
}
