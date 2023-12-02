import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [flightAvailability, setFlightAvailability] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          axios.get('/list_seat_types'),
          axios.get('/list_streaming_services'),
          axios.get('/list_food_items'),
          axios.get('/available_flights'),
        ]);
        setSeatTypes(responses[0].data);
        setStreamingServices(responses[1].data);
        setFoodItems(responses[2].data);
        setFlightAvailability(responses[3].data);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };
    fetchData();
  }, []);


  const handleFlightChange = (event) => {
    const { name, value } = event.target;
    setFlightDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUserInfoChange = (event) => {
    const { name, value } = event.target;
    setUserInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleUserInfoSubmit = async (event) => {
    event.preventDefault();
    // Here you would typically send the userInfo to the server
    // For demonstration purposes, we'll just set the submit status
    setSubmitStatus(`Thank you, ${userInfo.fullName}. We will email you shortly if a flight is available.`);

    // Clear the form fields
    setUserInfo({
      fullName: '',
      email: ''
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUserInfoSubmit(event); // Call the user info submit function
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
              name="flightId"
              value={flightDetails.flightId}
              onChange={handleFlightChange}
              required
            >
            <option value="">Select Flight</option>
            {flightAvailability.map((flight) => (
          <option key={flight[0]} value={flight[0]}>
            {flight[1]} - From {flight[2]} to {flight[5]} 
          </option>
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
      onChange={handleFlightChange} // Updated here
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
      onChange={handleFlightChange} // Updated here
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
      onChange={handleFlightChange} // Updated here
      required
    >
      <option value="">Select Food Item</option>
      {foodItems.map((item) => (
        <option key={item} value={item}>{item}</option>
      ))}
    </select>
  </label>
</div>

        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={userInfo.fullName}
            onChange={handleUserInfoChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleUserInfoChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {submitStatus && <p>{submitStatus}</p>}
    </div>
  );
}

export default CreateFlightForm;