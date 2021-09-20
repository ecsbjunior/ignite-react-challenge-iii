import { formatPrice } from '../../util/format';

import { useCart } from '../../hooks/useCart';
import { ProductTableItem } from '../../components/ProductTableItem';

import { Container, ProductTable, Total } from './styles';

const Cart = (): JSX.Element => {
  const { cart } = useCart();

  const cartFormatted = cart.map(product => ({
    id: product.id,
    title: product.title,
    priceFormatted: formatPrice(product.price),
    subTotalFormatted: formatPrice(product.price * product.amount),
    amount: product.amount,
    image: product.image
  }));

  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        return sumTotal += product.price * product.amount;
      }, 0)
    )

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {
            cartFormatted.map(product => {
              return (
                <ProductTableItem
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  priceFormatted={product.priceFormatted}
                  subTotalFormatted={product.subTotalFormatted}
                  amount={product.amount}
                  image={product.image}
                />
              )
            })
          }
        </tbody>
      </ProductTable>
      <footer>
        <button type="button">Finalizar pedido</button>
        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
