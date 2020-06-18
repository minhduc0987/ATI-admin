export class RolesTable {
	public static roles: any = [
		{
			roleId: 1,
			roleName: "Administrator",
			isCoreRole: true,
			permissions: [
				{
					functionId: 1,
					functionName: 'User manager',
					services: [
						{
							serviceId: 1,
							serviceAction: 'Xem'
						},
						{
							serviceId: 2,
							serviceAction: 'Sửa'
						},
						{
							serviceId: 3,
							serviceAction: 'Xóa'
						},
						{
							serviceId: 4,
							serviceAction: 'Duyệt'
						},
					],
				},
				
				{
					functionId: 2,
					functionName: 'Department manager',
					services: [
						{
							serviceId: 1,
							serviceAction: 'Xem'
						},
						{
							serviceId: 2,
							serviceAction: 'Sửa'
						},
						{
							serviceId: 3,
							serviceAction: 'Xóa'
						},
						{
							serviceId: 4,
							serviceAction: 'Duyệt'
						},
					],
				},
				{
					functionId: 3,
					functionName: 'Role manager',
					services: [
						{
							serviceId: 1,
							serviceAction: 'Xem'
						},
						{
							serviceId: 2,
							serviceAction: 'Sửa'
						},
						{
							serviceId: 3,
							serviceAction: 'Xóa'
						},
						{
							serviceId: 4,
							serviceAction: 'Duyệt'
						},
					],
				}
			],
		},
		{
			roleId: 2,
			roleName: "Manager",
			isCoreRole: false,
			permissions: [
				{
					functionId: 1,
					functionName: 'User manager',
					services: [
						{
							serviceId: 1,
							serviceAction: 'Xem'
						},
						{
							serviceId: 3,
							serviceAction: 'Xóa'
						}
					],
				},
				
				{
					functionId: 2,
					functionName: 'Department manager',
					services: [
						{
							serviceId: 3,
							serviceAction: 'Xóa'
						}
					],
				},
			],
		},
		{
			roleId: 3,
			roleName: "Guest",
			isCoreRole: false,
			permissions: [
				{
					functionId: 2,
					functionName: 'Department manager',
					services: [
						{
							serviceId: 3,
							serviceAction: 'Xóa'
						}
					],
				},
				{
					functionId: 3,
					functionName: 'Role manager',
					services: [
						{
							serviceId: 2,
							serviceAction: 'Sửa'
						},
						{
							serviceId: 4,
							serviceAction: 'Duyệt'
						},
					],
				}
			]
		}
	];
}
