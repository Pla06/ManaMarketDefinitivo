export interface Card {
  _id: string;
  name: string;
  collection: string;
  rarity: string;
  type: string;
  price: number;
  stock: number;
  language: string;
  condition: string;
  imageUrl: string;
  __v?: number;
}

export interface InterfaceCard {
  status: Card;
}

export interface InterfaceCards {
  status: Card[];
}
