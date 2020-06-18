export class UsersTable {
	public static users: any = [
		{
			userId: 1,
			username: 'admin',
			password: 'admin',
			email: 'admin@gmail.com',
			fullname: 'adminadmin',
			accessToken: 'string',
			roles: [
				{
					roleId: 1,
					roleName: 'Administrator'
				},
				{ roleId: 2, roleName: 'Manager' }
			],
			status: 'A',
			userType: 'A'
		},
		{
			userId: 2,
			username: 'user',
			email: 'user@gmail.com',
			fullname: 'useruser',
			roles: [
				{
					roleId: 1,
					roleName: 'Administrator'
				},
				{ roleId: 2, roleName: 'Manager' }
			],
			status: 'I',
			userType: 'A'
		},
		{
			userId: 3,
			username: 'admin1',
			email: 'admin1@gmail.com',
			fullname: 'admin1admin1',
			roles: [{ roleId: 3, roleName: 'Guest' }],
			status: 'I',
			userType: 'U'
		},
		{
			userId: 4,
			username: 'admin1',
			email: 'admin1@gmail.com',
			fullname: 'admin1admin1',
			roles: [{ roleId: 3, roleName: 'Guest' }],
			status: 'A',
			userType: 'U'
		},
		{
			userId: 5,
			username: 'admin1',
			email: 'admin1@gmail.com',
			fullname: 'admin1admin1',
			roles: [{ roleId: 3, roleName: 'Guest' }],
			status: 'A',
			userType: 'U'
		},
		{
			userId: 6,
			username: 'admin1',
			email: 'admin1@gmail.com',
			fullname: 'admin1admin1',
			roles: [{ roleId: 3, roleName: 'Guest' }],
			status: 'I',
			userType: 'U'
		},
		{
			userId: 12,
			username: 'user',
			email: 'user@gmail.com',
			fullname: 'useruser',
			roles: [
				{
					roleId: 1,
					roleName: 'Administrator'
				},
				{ roleId: 2, roleName: 'Manager' }
			],
			status: 'I',
			userType: 'U'
		},
		{
			userId: 13,
			username: 'admin1',
			email: 'admin1@gmail.com',
			fullname: 'admin1admin1',
			roles: [{ roleId: 3, roleName: 'Guest' }],
			status: 'I',
			userType: 'U'
		},
		{
			userId: 14,
			username: 'admin1',
			email: 'admin1@gmail.com',
			fullname: 'admin1admin1',
			roles: [{ roleId: 3, roleName: 'Guest' }],
			status: 'A',
			userType: 'U'
		},
		{
			userId: 15,
			username: 'admin1',
			email: 'admin1@gmail.com',
			fullname: 'admin1admin1',
			roles: [{ roleId: 3, roleName: 'Guest' }],
			status: 'A',
			userType: 'U'
		},
		{
			userId: 16,
			username: 'admin1',
			email: 'admin1@gmail.com',
			fullname: 'admin1admin1',
			roles: [{ roleId: 3, roleName: 'Guest' }],
			status: 'I',
			userType: 'U'
		},
		{
			userId: 22,
			username: 'user',
			email: 'user@gmail.com',
			fullname: 'useruser',
			roles: [
				{
					roleId: 1,
					roleName: 'Administrator'
				},
				{ roleId: 2, roleName: 'Manager' }
			],
			status: 'I',
			userType: 'U'
		},
		{
			userId: 23,
			username: 'admin1',
			email: 'admin1@gmail.com',
			fullname: 'admin1admin1',
			roleNames: [{ roleId: 3, roleName: 'Guest' }],
			status: 'I',
			userType: 'U'
		},
		{
			userId: 24,
			username: 'admin1',
			email: 'admin1@gmail.com',
			fullname: 'admin1admin1',
			roleNames: [{ roleId: 3, roleName: 'Guest' }],
			status: 'A',
			userType: 'U'
		},
		{
			userId: 25,
			username: 'admin1',
			email: 'admin1@gmail.com',
			fullname: 'admin1admin1',
			roleNames: [{ roleId: 3, roleName: 'Guest' }],
			status: 'A',
			userType: 'A'
		},
		{
			userId: 26,
			username: 'admin1',
			email: 'admin1@gmail.com',
			fullname: 'admin1admin1',
			roleNames: [{ roleId: 3, roleName: 'Guest' }],
			status: 'I',
			userType: 'U'
		}
	];

	public static tokens: any = [
		{
			id: 1,
			accessToken: 'access-token-' + Math.random(),
			refreshToken: 'access-token-' + Math.random()
		}
	];
	

}
