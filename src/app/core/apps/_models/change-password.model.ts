export class ChangePassword {
	confirmPassword: string;
	newPassword: string;
	oldPassword: string;
	username: string;

	clear() {
		this.confirmPassword = '';
		this.newPassword = '';
		this.oldPassword = '';
		this.username = '';
	}
}
