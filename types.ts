export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discountPercentage: number;
  buyLink: string;
  couponCode?: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface BannerContent {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    buttonText: string;
    link: string;
}