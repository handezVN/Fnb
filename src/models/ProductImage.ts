export const PRODUCT_IMAGES_TABLE = 'product_images';

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: Date;
}

export interface ProductImageCreateInput {
  product_id: string;
  image_url: string;
  sort_order?: number;
}
