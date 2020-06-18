import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FileUpload, HumanityFileUpload, HumanityFile } from '../_models/file-upload.model';
import { CampaignUploadMutil } from '../_actions/file-upload.actions';

const API_FILE_UPLOAD_URL = environment.apiUrl + 'file/upload';
const API_FILE_SHARE_URL = environment.apiUrl + 'file/share';
const API_FILE_URL = environment.apiUrl + 'file/';
const API_FILE_DELETE_BY_ID = environment.apiUrl + 'file/';


const API_HUMANITY_UPLOAD_URL = environment.apiUrl + 'file/multi';
const API_HUMANITY_UPLOAD_MULTIPLE_URL = environment.apiUrl + 'file/upload-multi';
const API_HUMANITY_GET_URL = environment.apiUrl + 'file/humanity/pic';
const API_HUMANITY_DELETE_FILE_TEMP_URL = environment.apiUrl + 'humanity/deleteListFileTem';

const API_CAMPAIGN_UPLOAD_URL = environment.apiUrl + 'file/campaign/upload';
const API_CAMPAIGN_CONTENT_UPLOAD_URL = environment.apiUrl + 'file/campaign/upload-content';
const API_CAMPAIGN_UPLOAD_MULTIPLE_URL = environment.apiUrl + 'file/campaign/upload-multi';



@Injectable()
export class FileUploadService {
	constructor(private http: HttpClient) { }

	// uploadFile(type: string, payload: FormData): Observable<FileUpload> {
	uploadFile(payload: FormData): Observable<FileUpload> {
		// return this.http.post<FileUpload>(`${API_FILE_UPLOAD_URL}/type?=${type}`, payload);
		return this.http.post<FileUpload>(API_FILE_UPLOAD_URL, payload);
	}

	uploadHumanityFile(humanityId: number, documentType: string, files: FormData[]): Observable<any> {
		return this.http.post<any>(`${API_HUMANITY_UPLOAD_URL}/${humanityId}?documentType=${documentType}`, files);
	}

	uploadMultipleHumanityFile(documentType: string, files: FormData): Observable<HumanityFileUpload> {
		const header = new HttpHeaders();
		header.set('Content-type', 'undefined');
		return this.http.post<HumanityFileUpload>
			(`${API_HUMANITY_UPLOAD_MULTIPLE_URL}?documentType=${documentType}`, files, { headers: header });
	}
	// uploadMultipleHumanityFile(files: FormData[]): Observable<any> {
	// 	return this.http.post<any>(`${API_HUMANITY_UPLOAD_MULTIPLE_URL}`, files);
	// }

	getFile(id: number): Observable<any> {
		return this.http.get<any>(API_FILE_URL + id);
	}
	getFileByURL(URL: string): Observable<any> {
		return this.http.get<any>(URL);
	}
	getHumanityFiles(documentType: string, humanityId: number): Observable<HumanityFile[]> {
		let httpRequest = `${API_HUMANITY_GET_URL}?`;
		if (documentType) {
			httpRequest += `documentType=${documentType}`;
		}
		if (humanityId) {
			httpRequest += `&humanityId=${humanityId}`;
		}
		return this.http.get<HumanityFile[]>(httpRequest);
	}

	deleteFileById(fileId): Observable<any> {
		return this.http.delete(API_FILE_DELETE_BY_ID + fileId);
	}

	deleteFileTemp(listLink$: string[]): Observable<any> {
		return this.http.put<any>(API_HUMANITY_DELETE_FILE_TEMP_URL, { listLink: listLink$ });
	}

	uploadImageCampaign(payload: FormData): Observable<FileUpload> {
		return this.http.post<FileUpload>(API_CAMPAIGN_UPLOAD_URL, payload);
	}

	campaigUpload(campaignId: number, documentType: string, files: FormData[]): Observable<any> {
		return this.http.post<any>(`${API_HUMANITY_UPLOAD_URL}/${campaignId}?documentType=${documentType}`, files);
	}

	campaigUploadMutil(documentType: string, files: FormData): Observable<HumanityFileUpload> {
		const header = new HttpHeaders();
		header.set('Content-type', 'undefined');
		return this.http.post<HumanityFileUpload>
			(`${API_CAMPAIGN_UPLOAD_MULTIPLE_URL}?documentType=${documentType}`, files, { headers: header });
	}

	campaignContentUpload(payload: FormData): Observable<FileUpload> {
		return this.http.post<FileUpload>(API_CAMPAIGN_CONTENT_UPLOAD_URL, payload);
	}
}
