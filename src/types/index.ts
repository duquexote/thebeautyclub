export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  position: string;
  location: string;
  imageUrl: string;
}

export * from './Socia';
export * from './Produto';

export interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: string;
}