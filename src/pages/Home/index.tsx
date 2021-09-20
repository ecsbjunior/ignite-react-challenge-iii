import { useState, useEffect } from 'react';

import { api } from '../../services/api';
import { formatPrice } from '../../util/format';

import { ProductListItem } from '../../components/ProductListItem';

import { ProductList } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get(`/products`);
      setProducts((response.data as Product[]).map(product => {
        return {
          id: product.id,
          title: product.title,
          price: product.price,
          priceFormatted: formatPrice(product.price),
          image: product.image
        }
      }));
    }

    loadProducts();
  }, []);

  return (
    <ProductList>
      {
        products.map(product => {
          return (
            <ProductListItem
              key={product.id}
              id={product.id}
              title={product.title}
              priceFormatted={product.priceFormatted}
              image={product.image}
            />
          )
        })
      }
    </ProductList>
  );
};

export default Home;
