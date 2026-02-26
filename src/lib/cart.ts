export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

let cartItems: CartItem[] = [];

export function getCart() {
  return cartItems;
}

export function addToCart(item: CartItem) {
  const existing = cartItems.find(x => x.id === item.id);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cartItems.push(item);
  }
  return cartItems;
}

export function removeFromCart(id: string) {
  cartItems = cartItems.filter(x => x.id !== id);
  return cartItems;
}

export function updateQuantity(id: string, qty: number) {
  const item = cartItems.find(x => x.id === id);
  if (item) item.quantity = qty;
  return cartItems;
}

export function clearCart() {
  cartItems = [];
}
