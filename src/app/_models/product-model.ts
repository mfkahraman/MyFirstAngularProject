import { ProductCategory } from "./product-category-model";

export class Product
{
  id;
  productName;
  categoryId: number | undefined;
  description;
  imagePath;

  //In order to get the category details along with product
  category: ProductCategory;
}
