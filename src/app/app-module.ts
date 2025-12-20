import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MainProductComponent } from './_main/main-product-component/main-product-component';
import { HeroComponent } from './_main/hero-component/hero-component';
import { ServicesComponent } from './_main/services-component/services-component';
import { AboutComponent } from './_main/about-component/about-component';
import { TeamComponent } from './_main/team-component/team-component';
import { ClientsComponent } from './_main/clients-component/clients-component';
import { BlogPreviewComponent } from './_main/blog-preview-component/blog-preview-component';
import { BlogListComponent } from './_main/blog-list-component/blog-list-component';
import { BlogDetailComponent } from './_main/blog-detail-component/blog-detail-component';
import { ContactComponent } from './_main/contact-component/contact-component';
import { HomeComponent } from './_main/home-component/home-component';
import { BlogCategoryComponent } from './admin/blog-category-component/blog-category-component';
import { ProductCategoryComponent } from './admin/product-category-component/product-category-component';
import { ProductComponent } from './admin/product-component/product-component';
import { TagComponent } from './admin/tag-component/tag-component';
import { EmployeeComponent } from './admin/employee-component/employee-component';
import { WriterComponent } from './admin/writer-component/writer-component';
import { BlogComponent } from './admin/blog-component/blog-component';
import { MessageComponent } from './admin/message-component/message-component';
import { DashboardComponent } from './admin/dashboard-component/dashboard-component';

@NgModule({
  declarations: [
    App,
    MainLayout,
    AdminLayout,
    MainProductComponent,
    HeroComponent,
    ServicesComponent,
    AboutComponent,
    TeamComponent,
    ClientsComponent,
    BlogPreviewComponent,
    BlogListComponent,
    BlogDetailComponent,
    ContactComponent,
    HomeComponent,
    BlogCategoryComponent,
    ProductCategoryComponent,
    ProductComponent,
    TagComponent,
    EmployeeComponent,
    WriterComponent,
    BlogComponent,
    MessageComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    DatePipe
  ],
  bootstrap: [App]
})
export class AppModule { }
