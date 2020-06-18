// Angular
import { Injectable } from '@angular/core';
// Angular in memory
import { InMemoryDbService } from 'angular-in-memory-web-api';
// RxJS
import { Observable } from 'rxjs';
// Auth
import { AuthDataContext } from '../../../../auth';
// Campaign
import { CampaignDataContext, DcndDataContext, DonateDataContext } from '../../../../apps';
// Models
import { CarsDb } from './fake-db/cars';

@Injectable()
export class FakeApiService implements InMemoryDbService {
	/**
	 * Service Constructor
	 */
	constructor() {}

	/**
	 * Create Fake DB and API
	 */
	createDb(): {} | Observable<{}> {
		// tslint:disable-next-line:class-name
		const db = {
			// auth module
			users: AuthDataContext.users,
			roles: AuthDataContext.roles,
			permissions: AuthDataContext.permissions,
			campaigns: CampaignDataContext.campaigns,
			dcnds: DcndDataContext.dcnds,
			donates: DonateDataContext.donates,
			cams: CarsDb.cars
		};
		return db;
	}
}
