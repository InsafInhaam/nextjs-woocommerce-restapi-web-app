import { isEmpty } from "lodash";

import axios from "axios";
// import { ADD_TO_CART_ENDPOINT } from '../../utils/constants/endpoints';
// import { getSession, storeSession } from '../../utils/cart/session';
// import { getAddOrViewCartConfig, getAddToCartConfig } from '../../utils/cart/api';

const AddToCart = ({ product }) => {
  if (isEmpty(product)) {
    return null;
  }

  return (
    <button
      onClick={() => addToCart(product?.id)}
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
    >
      Add to Cart
    </button>
  );
};

export default AddToCart;
