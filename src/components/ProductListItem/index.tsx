import { MdAddShoppingCart } from 'react-icons/md';

import { useCart } from '../../hooks/useCart';

interface ProductListItemProps {
  id: number;
  title: string;
  priceFormatted: string;
  image: string;
};

interface CartItemsAmount {
  [key: number]: number;
};

export function ProductListItem({ id, title, priceFormatted, image }: ProductListItemProps) {
  const { cart, addProduct } = useCart();

  const cartItemsAmount = cart.reduce(
    (sumAmount, product) => {
      console.log(product);
      sumAmount[product.id] = product.amount;
      return sumAmount;
    },
    {} as CartItemsAmount
  );

  function handleAddProduct(id: number) {
    if(!id || id <= 0) {
      return;
    }

    console.log('productId:', id);

    addProduct(id);
  }

  return (
    <li>
      <img src={image} alt={title} />
      <strong>{title}</strong>
      <span>{priceFormatted}</span>
      <button
        type="button"
        data-testid="add-product-button"
        onClick={() => handleAddProduct(id)}
      >
        <div data-testid="cart-product-quantity">
          <MdAddShoppingCart size={16} color="#FFF" />
          {cartItemsAmount[id] || 0}
        </div>

        <span>ADICIONAR AO CARRINHO</span>
      </button>
    </li>
  )
}