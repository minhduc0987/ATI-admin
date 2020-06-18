import { BaseModel } from '../../_base/crud';
import { Permission } from './../../auth/_models/permission.model';

export class Campaign extends BaseModel {
	campaignId: number;
	campaignCode: string;
	campaignTitle: string;
	startDate: string;
	endDate: string;
	createdBy: string;
	statusCode: string;
	campaignShowHome: boolean;
	campaignBriefStory: string;
	campaignDetail: string;
	campaignDesiedValue: string;
	campaignStartDate: string;
	campaignEndDate: string;
	campaignOrgDonate: string;
	campaignBeneficiary: string;
	campaignInfoDonate: string;
	campaignImgList: string;

	clear() {
		this.campaignId = undefined;
		this.campaignCode = '';
		this.campaignTitle = '';
		this.startDate = '';
		this.endDate = '';
		this.createdBy = '';
		this.statusCode = '';
		this.campaignShowHome = false;
		this.campaignBriefStory = '';
		this.campaignDetail = '';
		this.campaignDesiedValue = '';
		this.campaignStartDate = '';
		this.campaignEndDate = '';
		this.campaignOrgDonate = '';
		this.campaignBeneficiary = '';
		this.campaignInfoDonate = '';
		this.campaignImgList = '';
	}
}

export class CampaignsDelete extends BaseModel {
	campaignIds: number[];

	clear(): void {
		this.campaignIds = [];
	}
}

export class CampaignsChangeStatus extends BaseModel {
	campaignId: number;
	statusCode: string;
	reason: string;

	clear(): void {
		this.campaignId = undefined;
		this.statusCode = '';
		this.reason = '';
	}
}

// tslint:disable: variable-name
export class CampaignsEdit extends BaseModel {
	campaignProfile: string;
	campaignCode: string;
	index_view: boolean;
	title: string;
	summary: string;
	content: string;
	requestDetails: string;
	desiredValue: number;
	startDate: string;
	endDate: string;
	humanityIds: number[];
	campaignDocument: string;

	clear(): void {
		this.campaignProfile = '' ;
		this.campaignCode = '' ;
		this.index_view = false ;
		this.title = '' ;
		this.summary = '' ;
		this.content = '' ;
		this.requestDetails = '' ;
		this.desiredValue = 0 ;
		this.startDate = '' ;
		this.endDate = '' ;
		this.humanityIds = [] ;
		this.campaignDocument = '';

	}
}

export class CampaignSearchDcnds {
	campaignId: number;
	filter: any;
	pageNumber: number;
	pageSize: number;

	constructor(
		campaignId: number,
		filter: any,
		pageNumber: number = 0,
		pageSize: number = 10,
		) {
		this.campaignId = campaignId;
		this.filter = filter;
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
	}
}
