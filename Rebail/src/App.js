import './App.css';
import axios from "axios"
import React, { useState } from 'react';
import { atom, useRecoilState, selector, useRecoilValue } from 'recoil';

//Defina o estado do cartão com o átomo como um estado
const cartState = atom({
  key: "cartState", // Identificador unico
  default: [] // valor padrão da matriz vazia do carrinho
})

const quantidade = atom({
  key: "quantidadeState", // Identificador unico
  default: [] // valor padrão da matriz vazia do carrinho
})

// defina o estado total usando o seletor, pois precisamos calcular o preço total
const calculateCartTotal = (products) => {
  let total = 0;
  for (const product of products) {
    total += product.value * product.quantity;
  }
  return total;
}

// Com recoil ele tá pegando dados da API 
const productsQuery = selector({
  key: "Products",
  get: async () => {
    try {
      const res = await axios('https://api.catalogo.website/v1/api/products/catalogo?brand=peining')
      console.log(res.data.content)
      // return res.data.content || []
      return res.data.content || []

    } catch (error) {
      console.log(`Error: ${error}`)
      return []

    }
  }
})



const FakeProducts = ({ onAddCartItem, searchTerm, setCart }) => {
  // PEgando os dados da lista da api
  const dummyProducts = useRecoilValue(productsQuery)

  const [productQuantities, setProductQuantities] = useState({});

  console.log(`Os seguinte intens fora puxado da API: ${dummyProducts}`)

  const handleQuantityChange = (product, newQuantity) => {
    newQuantity = parseInt(newQuantity, 10);

    if (!isNaN(newQuantity)) {
      // Update the local state of quantity
      setProductQuantities((quantities) => ({
        ...quantities,
        [product._id]: newQuantity,
      }));
    }
  };

  // Filtro dos produtos
  const filteredProducts = dummyProducts.filter((product) =>
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div>
        <div>
          {filteredProducts.map((product) => (
            <div key={product._id} className="card-body">
              <h2>{product.description}</h2>
              <h5>{product.brand}</h5>
              <p>Value: ${product.value}</p>
              <p>Total Price: ${product.value * productQuantities[product._id]}</p>
              <label>Quantity: </label>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => handleQuantityChange(product, e.target.value)}
              />{" "}
              <button onClick={() => onAddCartItem(product)}>Add carrinho</button>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Visualização do carrinho
const Basket = ({ products, onRemoveCartItem, setCart }) => {

  const totalCartPrice = calculateCartTotal(products);

  const [quant, setQuant] = useRecoilState(quantidade)
  console.log("Minha quantidade do meu atom", quant)
  // const [ProductQuantities, setProductQuantities] = useRecoilState(quantidade)

  const handleQuantityChange = (product, newQuantity, setQuant) => {
    newQuantity = parseInt(newQuantity, 10);

    if (!isNaN(newQuantity)) {
      setCart((cart) => {
        const updatedCart = cart.map((item) => {
          if (item._id === product._id) {
            return { ...item, quantity: newQuantity, setQuant: newQuantity };
          }
          return item;
        });
        return updatedCart;
      });
    }
  };

  return (
    <>
      <div className='title'>Your Basket {!products.length ? "" : products.length}</div>
      <div className="basket">
        {products.length === 0
          ? "No items"
          : products.map((product) => (
            <p key={product._id}>
              {product.description} - Quantity:{" "}
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => handleQuantityChange(product, e.target.value)}
              />{" "}
              - Price: ${product.value} - Total Price: ${product.value * product.quantity}
              <button onClick={() => onRemoveCartItem(product)}>Remove</button>
            </p>
          ))
        }
      </div>
      {!products.length ? "" : <div className="total">Total: ${totalCartPrice}</div>}
    </>
  )
}

function App() {
  // set estado do carrinho
  const [cart, setCart] = useRecoilState(cartState)
  // Preco total do carrinho
  // const [{ total }, setTotalFromSelector] = useRecoilState(cartTotalState)
  const [searchTerm, setSearchTerm] = useState('')

  // adicionar produto ao carrinho
  const addCarItem = (product) => {
    setCart((cart) => {
      const productIndex = cart.findIndex((item) => item._id === product._id);

      if (productIndex === -1) {
        // O produto não está no carrinho, então adicionamos uma nova entrada
        return [...cart, { ...product, quantity: 1 }];
      } else {
        // O produto já está no carrinho, então atualizamos a quantidade
        const updatedCart = [...cart];
        updatedCart[productIndex] = {
          ...updatedCart[productIndex],
          quantity: updatedCart[productIndex].quantity + 1,
        };
        return updatedCart;
      }
    });
  }

  // const addCarItem = (product) => {
  //   setCart((cart) => {
  //     cart.find((item) => item.id === product.id)
  //       ? cart
  //       : [...cart, product]
  //   })
  // }

  // Remove produto do carrinho
  const removeCartItem = (product) => {
    setCart((cart) => {
      const productIndex = cart.findIndex((item) => item._id === product._id);

      if (productIndex !== -1) {
        const updatedCart = [...cart];
        if (updatedCart[productIndex].quantity > 1) {
          updatedCart[productIndex] = {
            ...updatedCart[productIndex],
            quantity: updatedCart[productIndex].quantity - 1,
          };
        } else {
          updatedCart.splice(productIndex, 1);
        }
        return updatedCart;
      }
      return cart;
    });
  }
  return (
    <div className="App">
      {/* Campo de pesquisa */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <React.Suspense fallback={<div> Loading...</div>}>
        {/* Mapeamento */}
        <FakeProducts setCart={setCart} onAddCartItem={addCarItem} searchTerm={searchTerm}></FakeProducts>
      </React.Suspense>

      <div className="floatcart">
        {/* <Basket total={total} setCart={setTotalFromSelector} products={cart} onRemoveCartItem={removeCartItem} /> */}
        <Basket products={cart} onRemoveCartItem={removeCartItem} setCart={setCart} />
      </div>
    </div>
  );
}

export default App;