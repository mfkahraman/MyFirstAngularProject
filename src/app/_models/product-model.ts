import { ProductCategory } from "./product-category-model";

export class Product
{
  id;
  productName: string;
  shortDescription: string;
  description: string;
  imagePath: string;
  thumbnailImagePath: string;
  categoryId: number | undefined;
  clientName: string;
  projectUrl: string;
  projectDate: Date;
  //In order to get the category details along with product
  category: ProductCategory;
}
