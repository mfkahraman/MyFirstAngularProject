import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './admin/product-category-component/product-category-component';
import { App } from './app';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { ProductComponent } from './admin/product/productComponent';

const routes: Routes = [
//Main Routes
{path:'',component:MainLayout,children:[

]},

//Admin Routes
{path:'admin',component:AdminLayout,children:[
  {path:'category',component:CategoryComponent},
  {path:'product',component:ProductComponent}
]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
