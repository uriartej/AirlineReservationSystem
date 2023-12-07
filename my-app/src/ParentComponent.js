// ParentComponent.js
import React, { useState } from 'react';
import CreateFlightForm from './CreateFlightForm';
import CartDisplay from './CartDisplay';
import CheckoutForm from './CheckoutForm';

const ParentComponent = () => {
  const [cart, setCart] = useState([]);
  const [isCheckout, setIsCheckout] = useState(false);

  const addToCart = (flightDetails) => {
    // Add the selected flight details to the cart
    setCart(currentCart => [...currentCart, flightDetails]);
  };

  const removeFromCart = (flightId) => {
    // Remove an item from the cart by flightId
    setCart(currentCart => currentCart.filter(flight => flight.id !== flightId));
  };

  const proceedToCheckout = () => {
    // Trigger the checkout process
    setIsCheckout(true);
  };

  const finalizeCheckout = () => {
    // Finalize the checkout process and reset the cart
    setIsCheckout(false);
    setCart([]);
  };

  return (
    <div>
      {!isCheckout ? (
        <>
          <CreateFlightForm addFlightToCart={addToCart} />
          {cart.length > 0 && (
            <CartDisplay 
              cart={cart} 
              removeFromCart={removeFromCart} 
              proceedToCheckout={proceedToCheckout} 
            />
          )}
        </>
      ) : (
        <CheckoutForm finalizeCheckout={finalizeCheckout} />
      )}
    </div>
  );
};

export default ParentComponent;
