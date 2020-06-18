// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material';
// Translate
import { TranslateService } from '@ngx-translate/core';
import { PaginatorI18n } from '../../shared/translates/paginatorI18n';

@NgModule({
	declarations: [],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		MatPaginatorModule 
	],
	providers: [
		{ provide: MatPaginatorIntl, deps: [TranslateService],
		  useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl() }
	]
})
export class PagesModule {
}
