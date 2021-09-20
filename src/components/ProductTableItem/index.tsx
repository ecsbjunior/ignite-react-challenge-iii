import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';

interface ProductTableItemProps {
  id: number;
  title: string;
  priceFormatted: string;
  subTotalFormatted: string;
  amount: number;
  image: string;
};

interface Product {
  id: number;
  amount: number;
};

export function ProductTableItem({ id, title, priceFormatted, subTotalFormatted, amount, image }: ProductTableItemProps) {
  const { updateProductAmount, removeProduct } = useCart();

  function handleProductIncrement({ id, amount }: Product) {
    updateProductAmount({
      productId: id,
      amount: amount + 1
    });
  }

  function handleProductDecrement({ id, amount }: Product) {
    updateProductAmount({
      productId: id,
      amount: amount - 1
    });
  }

  function handleRemoveProduct(productId: number) {
    if(!productId || productId <= 0) {
      return;
    }

    removeProduct(productId);
  }
  
  return (
    <tr data-testid="product">
      <td>
        <img src={image} alt={title} />
      </td>
      <td>
        <strong>{title}</strong>
        <span>{priceFormatted}</span>
      </td>
      <td>
        <div>
          <button
            type="button"
            data-testid="decrement-product"
            disabled={amount <= 1}
            onClick={() => handleProductDecrement({ id, amount })}
          >
            <MdRemoveCircleOutline size={20} />
          </button>
          <input
            type="text"
            data-testid="product-amount"
            readOnly
            value={amount}
          />
          <button
            type="button"
            data-testid="increment-product"
            onClick={() => handleProductIncrement({ id, amount })}
          >
            <MdAddCircleOutline size={20} />
          </button>
        </div>
      </td>
      <td>
        <strong>{subTotalFormatted}</strong>
      </td>
      <td>
        <button
          type="button"
          data-testid="remove-product"
          onClick={() => handleRemoveProduct(id)}
        >
          <MdDelete size={20} />
        </button>
      </td>
    </tr>
  )
}
