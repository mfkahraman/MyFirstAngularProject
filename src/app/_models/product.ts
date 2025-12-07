import { Category } from "./category";

export class Product
{
  id;
  productName;
  categoryId = 0;
  description;
  imagePath;

  //In order to get the category details along with product
  category: Category;
}
