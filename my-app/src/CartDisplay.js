import React from 'react';

const CartDisplay = ({ cart, removeFromCart }) => {
  // Make sure cart is an array and removeFromCart is a function
  if (!cart || !Array.isArray(cart) || typeof removeFromCart !== 'function') {
    return null; // or some error message
  }

  if (cart.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.map((item, index) => (
        <div key={item.id || index}> {/* Make sure each cart item has a unique 'id' */}
          <p>Flight Number: {item.flightNumber}</p>
          <p>From: {item.source} To: {item.destination}</p>
          <p>Seat Type: {item.seatType}</p>
          <p>Streaming Service: {item.streamingService}</p>
          <p>Food Item: {item.foodItem}</p>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default CartDisplay;
