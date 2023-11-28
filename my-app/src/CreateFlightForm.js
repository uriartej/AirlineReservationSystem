import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckoutForm from './CheckoutForm';
import './Cart.css';

function CreateFlightForm() {
  const [flightDetails, setFlightDetails] = useState({
    flightNumber: '',
    source: '',
    destination: '',
    capacity: '',
    price: '',
    seatType: '',
    streamingService: '',
    foodItem: '',
  });
  const [seatTypes, setSeatTypes] = useState([]);
  const [streamingServices, setStreamingServices] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [flightAvailability, setDestination] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    // Fetch data for seat types, streaming services, and food items
    const fetchData = async () => {
      try {
        const seatTypesRes = await axios.get('/list_seat_types');
        const streamingServicesRes = await axios.get('/list_streaming_services');
        const foodItemsRes = await axios.get('/list_food_items');
        const flightAvailabilityRes = await axios.get('/available_flights');
        
        setSeatTypes(seatTypesRes.data);
        setStreamingServices(streamingServicesRes.data);
        setFoodItems(foodItemsRes.data);
        setDestination(flightAvailabilityRes.data);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/create_flight', flightDetails);
      setSubmitStatus('Flight created successfully!');
      console.log(response.data.message); // Or handle the success response as needed
      // Clear form fields
      setFlightDetails({
        flightNumber: '',
        source: '',
        destination: '',
        capacity: '',
        price: '',
        seatType: '',
        streamingService: '',
        foodItem: '',
      });
    } catch (error) {
      setSubmitStatus('Failed to create flight.');
      console.error("Failed to create flight: ", error);
    }
  };

  const handleChange = (event) => {
    setFlightDetails({
      ...flightDetails,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <h2>Create Flight</h2>
      {submitStatus && <p>{submitStatus}</p>}
      <form onSubmit={handleSubmit}>
        {/* Input fields for flight details */}

        <div>
          <label>
            Flight Availability:
            <select
              name="destination"
              value={flightDetails.destination}
              onChange={handleChange}
              required
            >
            <option value="">Select Flight</option>
            {flightAvailability.map((type) => (
              <option key = {type} value={type}>{type}</option>
            ))}
            </select>
          </label>
        </div>


        {/* Select field for Seat Type */}
        <div>
          <label>
            Seat Type:
            <select
              name="seatType"
              value={flightDetails.seatType}
              onChange={handleChange}
              required
            >
              <option value="">Select Seat Type</option>
              {seatTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Select field for Streaming Service */}
        <div>
          <label>
            Streaming Service:
            <select
              name="streamingService"
              value={flightDetails.streamingService}
              onChange={handleChange}
              required
            >
              <option value="">Select Streaming Service</option>
              {streamingServices.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Select field for Food Item */}
        <div>
          <label>
            Food Item:
            <select
              name="foodItem"
              value={flightDetails.foodItem}
              onChange={handleChange}
              required
            >
              <option value="">Select Food Item</option>
              {foodItems.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit">Create Flight</button>
      </form>
    </div>
  );
}

export default CreateFlightForm;
