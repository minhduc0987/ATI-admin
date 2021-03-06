export class PermissionsTable {
	public static permissions: any = [
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
                }
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
                }
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
    ];
}
