export const calculateCartTotal = (cart) => {
  let total = 0;

  cart.items.forEach((item) => {
    item.totalItemPrice = item.quantity * item.price;
    total += item.totalItemPrice;
  });

  cart.totalPrice = total;
};
