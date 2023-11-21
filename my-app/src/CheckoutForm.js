import React, { useState } from 'react';

const CheckoutForm = ({ finalizeCheckout }) => {
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    address: '',
    cardholderName: '',
    cardNumber: '',
    cvv: '',
    expirationMonth: '',
    expirationYear: '',
    postalCode: ''
  });

  const handleChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the submission, such as validating and processing the payment
    finalizeCheckout(customerDetails);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Checkout</h2>

      {/* Customer Details */}
      <div>
        <label>
          Name:
          <input 
            name="name" 
            value={customerDetails.name} 
            onChange={handleChange} 
            required 
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input 
            type="email" 
            name="email" 
            value={customerDetails.email} 
            onChange={handleChange} 
            required 
          />
        </label>
      </div>
      <div>
        <label>
          Address:
          <input 
            name="address" 
            value={customerDetails.address} 
            onChange={handleChange} 
            required 
          />
        </label>
      </div>

      {/* Payment Information */}
      <div>
        <label>
          Cardholder name:
          <input 
            name="cardholderName" 
            value={customerDetails.cardholderName} 
            onChange={handleChange} 
            required 
          />
        </label>
      </div>
      <div>
        <label>
          Credit card number:
          <input 
            type="number" 
            name="cardNumber" 
            value={customerDetails.cardNumber} 
            onChange={handleChange} 
            required 
          />
        </label>
      </div>
      <div>
        <label>
          CVV:
          <input 
            type="number" 
            name="cvv" 
            value={customerDetails.cvv} 
            onChange={handleChange} 
            required 
          />
        </label>
      </div>
      <div>
        <label>
          Expiration Date:
          <input 
            type="text" 
            placeholder="MM" 
            name="expirationMonth" 
            value={customerDetails.expirationMonth} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            placeholder="YYYY" 
            name="expirationYear" 
            value={customerDetails.expirationYear} 
            onChange={handleChange} 
            required 
          />
        </label>
      </div>
      <div>
        <label>
          Postal Code:
          <input 
            name="postalCode" 
            value={customerDetails.postalCode} 
            onChange={handleChange} 
            required 
          />
        </label>
      </div>

      <button type="submit">Submit Checkout</button>
    </form>
  );
};

export default CheckoutForm;
