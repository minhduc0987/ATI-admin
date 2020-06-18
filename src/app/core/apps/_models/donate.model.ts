import { BaseModel } from '../../_base/crud';

export class Donate extends BaseModel {
	fundId: number;
	fundName: string;
	fundStatus: string;
	fundPrice: string;
	fundActualPrice: string;
	campaignName: string;
	humanityName: string;
	donator: string;

	clear() {
		this.fundId = undefined;
		this.fundName = '';
		this.fundActualPrice = '';
		this.campaignName = '';
		this.humanityName = '';
		this.donator = '';
		this.fundPrice = '';
		this.fundStatus = '';
	}
}

export class DonatesStatus extends BaseModel {
	fundId: number;
	rejectReson: string;
	fundActualPrice: number;
}

export class ViewDonate extends BaseModel {
	// tslint:disable: variable-name
	humanity_name: string;
	campaign_name: string;
	fund_name: string;
	fund_email: string;
 	fund_phone: string;
	fund_price: number;
	fund_actual_price: number;
	fund_status: string;
	wishes: string;
	view_humanity: string;
	type: string;
}

