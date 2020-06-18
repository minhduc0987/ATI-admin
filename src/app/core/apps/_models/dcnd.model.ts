import { BaseModel } from '../../_base/crud';

export class Dcnd extends BaseModel {
	humanityId: number;
	humanityCode: string;
	humanityTitle: string;
	humanityReceive: string;
	humanityAddress: string;
	createdBy: string;
	statusCode: string;
	humanityUpload: boolean;

}

export class DcndDelete extends BaseModel {
	humanityIds: number[];

	clear(): void {
		this.humanityIds = [];
	}
}

export class DcndUpdate extends BaseModel {
	humanityId: number;
	statusCode: string;
	reason: string;

	clear(): void {
		this.humanityId = undefined;
		this.statusCode = '';
		this.reason = '';
	}
}

export class DcndEdit extends BaseModel {
	receiverName: string;
	receiverGender: string;
	dob: string;
	provinceId: number;
	provinceName: string;
	districtId: number;
	districtName: string;
	wardId: number;
	wardName: string;
	address: string;
	addressLine: string;
	statusCode: string;
	receiverPhone: string;
	avatar: string;
	guarderName: string;
	guarderPhone: number;
	guarderAddress: string;
	guarderListPicture = [];
	indexView: boolean;
	code: string;
	title: string;
	summary: string;
	content: string;
	humanityUpload = [];
	humanityId: number;
	contentMobile: string;

	narrative: string;
	accountHolder: string;
	accountNumber: string;
	brandName: string;

	createdBy: string;
	createdDate: string;
	updatedBy: string;
	updatedDate: string;
	approvedBy: string;
	approvedDate: string;
	verifiedBy: string;
	verifiedDate: string;
	rejectBy: string;
	rejectDate: string;

	rejectReason: string;
	approvedReason: string;
	verifiedReason: string;

	lat: number;
	long: number;


	clear() {
		this.receiverName = '';
		this.receiverGender = '';
		this.dob = '';
		this.provinceId = undefined;
		this.districtId = undefined;
		this.wardId = undefined;
		this.address = '';
		this.receiverPhone = '';
		this.avatar = '';
		this.guarderName = '';
		this.guarderPhone = undefined;
		this.guarderAddress = '';
		this.guarderListPicture = undefined;
		this.indexView = undefined;
		this.code = '';
		this.title = '';
		this.summary = '';
		this.content = '';
		this.humanityUpload = undefined;
	}
}

export class DcndIndexView {
	humanityId: number;
	indexView: boolean;
}
