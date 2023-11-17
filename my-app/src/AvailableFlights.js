import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './Cart.css';
import CheckoutForm from './CheckoutForm';
import calculateTotal from './calculation';

const CartDisplay = ({ cart, handleCheckout, handleRemoveFromCart, total }) => {
  return (
    <div className="cart-display">
      <h2>Your Reservations</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index} className="cart-item">
            Flight {item.flightNumber} on {item.date} from {item.source} to {item.destination} - Seat: {item.seatType}, Streaming: {item.streamingService}, Food: {item.foodItem}
            <button onClick={() => handleRemoveFromCart(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>Total: ${total}</div>
      <button className="button" onClick={handleCheckout}>Checkout</button>
    </div>
  );
};


const AvailableFlights = () => {
  const [flights, setFlights] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [streamingServices, setStreamingServices] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [reservations, setReservations] = useState({});
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [error,setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the data for flights, seat types, streaming services, and food items
        const [flightsResponse, seatTypesResponse, streamingServicesResponse, foodItemsResponse] = await Promise.all([
          axios.get('/available_flights'),
          axios.get('/list_seat_types'),
          axios.get('/list_streaming_services'),
          axios.get('/list_food_items')
        ]);
  
        // Update the flights state
        const flightsData = flightsResponse.data.map(flightArray => ({
          id: flightArray[0],
          flight_number: flightArray[1],
          source: flightArray[2],
          destination: flightArray[5],
          // Include other properties as needed
        }));
        setFlights(flightsData);
  
        // Update the state for seat types, streaming services, and food items
        setSeatTypes(seatTypesResponse.data);
        setStreamingServices(streamingServicesResponse.data);
        setFoodItems(foodItemsResponse.data);
  
        // Initialize reservations with default values for each flight
        const initialReservations = flightsData.reduce((acc, flight) => {
          acc[flight.id] = {
            name: '',
            seats: 1,
            seatType: '',
            streamingService: '',
            foodItem: '',
          };
          return acc;
        }, {});
        setReservations(initialReservations);
  
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      }
    };
  
    fetchData();
  }, []);
  

  if (error) {
    return <div>An error occurred: {error.message}</div>;  // Display error
  }


  const addToCart = (flightId) => {
    const reservation = reservations[flightId];
    if (reservation && reservation.name && reservation.seatType && reservation.streamingService && reservation.foodItem && reservation.seats) {
      setCart(prevCart => [...prevCart, { ...reservation, flightNumber: flightId }]);
    } else {
      alert('Please fill in all fields before reserving.');
    }
  };

  const handleRemoveFromCart = (index) => {
    setCart(currentCart => currentCart.filter((_, idx) => idx !== index));
  };


  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Please add at least one reservation to your cart before proceeding to checkout.');
    } else {
      setShowCheckoutForm(true);
    }
  };

  const finalizeCheckout = (customerDetails) => {
    console.log(customerDetails);
    setShowCheckoutForm(false);
    setCart([]);
  };

  const handleInputChange = (flightId, name, value) => {
    setReservations(prevReservations => ({
      ...prevReservations,
      [flightId]: {
        ...prevReservations[flightId],
        [name]: value,
      },
    }));
  };

  const renderFlightOptions = (flight) => {
    const reservationDetails = reservations[flight.id] || {
      name: '',
      seats: 1, // Assume default is 1 seat
      seatType: '',
      streamingService: '',
      foodItem: '',

    };


    return (
      <div>
        <label>
          Name:
          <input
            className="input-field"
            name="name"
            value={reservationDetails.name || ''}
            onChange={(e) => handleInputChange(flight.id, 'name', e.target.value)}
          />
        </label>
        <label>
          Number of Seats:
          <input
            type="number"
            min="1"
            className="input-field"
            name="seats"
            value={reservationDetails.seats || ''}
            onChange={(e) => handleInputChange(flight.id, 'seats', e.target.value)}
          />
        </label>
        <label>
          Seat type:
          <select
            className="select-field"
            name="seatType"
            value={reservationDetails.seatType || ''}
            onChange={(e) => handleInputChange(flight.id, 'seatType', e.target.value)}
          >
            <option value="">Select seat type</option>
            {seatTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <label>
          Streaming Service:
          <select
            className="select-field"
            name="streamingService"
            value={reservationDetails.streamingService || ''}
            onChange={(e) => handleInputChange(flight.id, 'streamingService', e.target.value)}
          >
            <option value="">Select streaming service</option>
            {streamingServices.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </label>
        <label>
          Food Item:
          <select
            className="select-field"
            name="foodItem"
            value={reservationDetails.foodItem || ''}
            onChange={(e) => handleInputChange(flight.id, 'foodItem', e.target.value)}
          >
            <option value="">Select food item</option>
            {foodItems.map((food) => (
              <option key={food} value={food}>{food}</option>
            ))}
          </select>
        </label>
        <button
          className="button"
          onClick={() => addToCart(flight.id)}
        >
          Reserve
        </button>
      </div>
    );
  };


  const total = calculateTotal(cart, flights, foodItems, seatTypes, streamingServices);

  if (showCheckoutForm) {
    return <CheckoutForm finalizeCheckout={finalizeCheckout} />;
  }

  return (
    <div className="container">
      <h2>Available Flights</h2>
      {!showCheckoutForm && (
        <>
          <ul style={{ listStyleType: 'none' }}>
            {flights.map(flight => (
              <li key={flight.id}>
                <span>{flight.flight_number} - From: {flight.source} to {flight.destination}</span>
                {renderFlightOptions(flight)}
              </li>
            ))}
          </ul>
          {/* Pass the total to CartDisplay */}
          <CartDisplay
            cart={cart}
            handleCheckout={handleCheckout}
            handleRemoveFromCart={handleRemoveFromCart}
            total={total}
          />
        </>
      )}
    </div>
  );
};

export default AvailableFlights;
