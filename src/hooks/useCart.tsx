import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { api } from '../services/api';

import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const stock = (await api.get(`/stock/${productId}`)).data as Stock;

      const filteredProduct = cart.find(product => product.id === productId);

      if (!filteredProduct) {
        if (1 > stock.amount) {
          toast.error('Quantidade solicitada fora de estoque');
          return
        }

        const response = await api.get(`/products/${productId}`);

        const newProduct = {
          id: response.data.id,
          title: response.data.title,
          price: response.data.price,
          amount: 1,
          image: response.data.image
        };

        const newCart = [...cart, newProduct];

        setCart(newCart);

        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));
      }
      else {
        if (filteredProduct.amount + 1 > stock.amount) {
          toast.error('Quantidade solicitada fora de estoque');
          return
        }

        filteredProduct.amount++;

        setCart([...cart]);

        localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
      }
    }
    catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const removedProductIndex = cart.findIndex(product => product.id === productId);

      if(removedProductIndex < 0) {
        throw new Error();
      }

      const filteredCart = cart.filter(product => product.id !== productId);

      setCart(filteredCart);

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(filteredCart));
    }
    catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if(amount <= 0) {
        return;
      }
      
      const stock = (await api.get(`/stock/${productId}`)).data as Stock;

      if (amount > stock.amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      const newCart = cart.map(product => {
        if (product.id === productId) {
          product.amount = amount;
        }

        return product;
      });

      setCart(newCart);

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));
    }
    catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
