import { Category } from "./category";

export class Product
{
  id;
  productName;
  imageUrl;
  description;
  categoryId;

  //In order to get the category details along with product
  category: Category;
}
