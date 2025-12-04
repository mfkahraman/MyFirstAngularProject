import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Category } from './admin/category/category';
import { App } from './app';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Product } from './admin/product/product';

const routes: Routes = [
//Main Routes
{path:'',component:MainLayout,children:[

]},

//Admin Routes
{path:'admin',component:AdminLayout,children:[
  {path:'category',component:Category},
  {path:'product',component:Product}
]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
