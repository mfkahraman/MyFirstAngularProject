import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MainProductComponent } from './_main/main-product-component/main-product-component';
import { BlogCategoryComponent } from './admin/blog-category-component/blog-category-component';
import { ProductCategoryComponent } from './admin/product-category-component/product-category-component';
import { ProductComponent } from './admin/product-component/product-component';
import { TagComponent } from './admin/tag-component/tag-component';

@NgModule({
  declarations: [
    App,
    MainLayout,
    AdminLayout,
    MainProductComponent,
    BlogCategoryComponent,
    ProductCategoryComponent,
    ProductComponent,
    TagComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
