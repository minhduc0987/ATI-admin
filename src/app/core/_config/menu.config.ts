export class MenuConfig {
	public defaults: any = {
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'flaticon2-architecture-and-city',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{ section: 'Applications' },
				{
					title: 'Quản lý người dùng',
					root: true,
					icon: 'flaticon2-user-outline-symbol',
					translate: 'MENU.USERS',
					bullet: 'dot',
					submenu: [
						{
							title: 'Users',
							page: '/user-management/users',
							serviceCode: 'USER_READ',
						},
						{
							title: 'Roles',
							page: '/user-management/roles',
							serviceCode: 'ROLE_READ',
						},
					],
				},
				{
					title: 'Quản lý địa chỉ nhân đạo',
					root: true,
					icon: 'flaticon2-user-outline-symbol',
					translate: 'MENU.DCND',
					bullet: 'dot',
					submenu: [
						{
							title: 'Địa chỉ nhân đạo',
							page: '/dcnd-managerment/list',
							serviceCode: 'DCND_READ',
						},
					],
				},
				{
					title: 'Quản lý tài trợ',
					root: true,
					icon: 'flaticon2-user-outline-symbol',
					translate: 'MENU.DONATE',
					bullet: 'dot',
					submenu: [
						{
							title: 'Tài trợ',
							page: '/donates-managerment/list',
							serviceCode: 'PLAN_READ',
						},
					],
				},
				{
					title: 'Quản lý chiến dịch',
					root: true,
					icon: 'flaticon2-user-outline-symbol',
					translate: 'MENU.CAMPAIGNS',
					bullet: 'dot',
					submenu: [
						{
							title: 'Chiến dịch',
							page: '/campaigns-managerment/list',
							serviceCode: 'CAMPAIGN_READ',
						},
					],
				},
				{
					title: 'Quản lí người dùng vi phạm',
					root: true,
					icon: 'flaticon2-user-outline-symbol',
					translate: 'MENU.USER_SPAM',
					bullet: 'dot',
					submenu: [
						{
							title: 'Danh sách vi phạm',
							page: '/user-spam/list',
							serviceCode: 'ACCOUNT_LOCK_READ',
						},
					],
				},
			],
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
