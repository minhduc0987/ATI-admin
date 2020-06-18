import { BaseModel } from '../../_base/crud';

export class Permission {
	constructor(
		public functionId?: number,
		public functionName?: string,
		public services?: ServiceModel[],
		public isSelected?: boolean,
	) { }
}

export class ServiceModel {
	constructor(
		public serviceId?: number,
		public serviceName?: string,
		public isSelected?: boolean,
	) { }
}
