import React, { useState, useEffect } from "react";

export const AppContext = React.createContext([{}, () => {}]);

export const AppProvider = (props) => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    if (process.browser) {
      let cartData = localStorage.getItem("next-cart");
      cartData = null !== cartData ? JSON.parse(cartData) : "";
      setCart(cartData);
    }
  }, []);

  useEffect(() => {
    if (process.browser) {
      localStorage.setItem("next-cart", JSON.stringify(cart));
    }
  }, [cart]);

  return (
    <AppContext.Provider value={[cart, setCart]}>
      {props.children}
    </AppContext.Provider>
  );
};
