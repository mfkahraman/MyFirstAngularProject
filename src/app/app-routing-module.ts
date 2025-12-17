import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { App } from './app';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { BlogCategoryComponent } from './admin/blog-category-component/blog-category-component';
import { ProductComponent } from './admin/product-component/product-component';
import { ProductCategoryComponent } from './admin/product-category-component/product-category-component';
import { TagComponent } from './admin/tag-component/tag-component';
import { EmployeeComponent } from './admin/employee-component/employee-component';
import { WriterComponent } from './admin/writer-component/writer-component';
import { BlogComponent } from './admin/blog-component/blog-component';
import { MessageComponent } from './admin/message-component/message-component';

const routes: Routes = [
  //Main Routes
  {
    path: '', component: MainLayout, children: [

    ]
  },

  //Admin Routes
  {
    path: 'admin', component: AdminLayout, children: [
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
