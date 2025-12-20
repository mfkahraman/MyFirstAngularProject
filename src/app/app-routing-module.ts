import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { App } from './app';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { HomeComponent } from './_main/home-component/home-component';
import { BlogListComponent } from './_main/blog-list-component/blog-list-component';
import { BlogDetailComponent } from './_main/blog-detail-component/blog-detail-component';
import { ContactComponent } from './_main/contact-component/contact-component';
import { BlogCategoryComponent } from './admin/blog-category-component/blog-category-component';
import { ProductComponent } from './admin/product-component/product-component';
import { ProductCategoryComponent } from './admin/product-category-component/product-category-component';
import { TagComponent } from './admin/tag-component/tag-component';
import { EmployeeComponent } from './admin/employee-component/employee-component';
import { WriterComponent } from './admin/writer-component/writer-component';
import { BlogComponent } from './admin/blog-component/blog-component';
import { MessageComponent } from './admin/message-component/message-component';
import { DashboardComponent } from './admin/dashboard-component/dashboard-component';

const routes: Routes = [
  //Main Routes
  {
    path: '', component: MainLayout, children: [
      { path: '', component: HomeComponent },
      { path: 'blog', component: BlogListComponent },
      { path: 'blog/:id', component: BlogDetailComponent },
      { path: 'contact', component: ContactComponent }
    ]
  },

  //Admin Routes
  {
    path: 'admin', component: AdminLayout, children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'productcategory', component: ProductCategoryComponent },
      { path: 'product', component: ProductComponent },
      { path: 'blogcategory', component: BlogCategoryComponent },
      { path: 'tag', component: TagComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: 'writer', component: WriterComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'message', component: MessageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top', // Scroll to top on route change
    anchorScrolling: 'enabled' // Enable scrolling to anchors
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
