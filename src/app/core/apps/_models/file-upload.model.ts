export class FileUpload {
	link: string;
	owner: string;
	createdDate: string;
}

export class HumanityFileUpload {
	files: HumanityFile[];
	message: string;
}
export class HumanityFile {
	fileId: number;
	fileNameUpload: string;
	pathFileServer: string;
}

export class CampaignFileUpload {
	files: CampaignFile[];
	message: string;
}
export class CampaignFile {
	fileId: number;
	fileNameUpload: string;
	pathFileServer: string;
}
