export class UserSpamModel {
	userId: number;
	fullname: string;
	phone: string;
	email: string;
	lockType: string;
	time: string;
}

export class UserSpamUpdateModel {
	userId: number;
	lockType: string;
}
