import React, {useEffect, useState} from 'react';

export const calculateTotal = (cart, flights, foodItems, seatTypes, streamingServices) => {
  let total = 0;

  cart.forEach(item => {
    const flight = flights.find(f => f.id === item.flightId);
    const flightPrice = flight ? flight.price : 0;

    const foodItem = foodItems.find(f => f.id === item.foodItemId);
    const foodItemPrice = foodItem ? foodItem.price : 0;

    const seatType = seatTypes.find(s => s.id === item.seatTypeId);
    const seatTypePrice = seatType ? seatType.price_multiplier : 1;

    const streamingService = streamingServices.find(s => s.id === item.streamingServiceId);
    const streamingServicePrice = streamingService ? streamingService.price : 0;

    total += (flightPrice + foodItemPrice + seatTypePrice + streamingServicePrice) * item.numberOfSeats;
  });

  return total.toFixed(2); // Convert the total to a string with 2 decimal places
};

 const CalculationComponent = ({cart}) => {
  // State for storing data fetched from the API
  const [data, setData] = useState({
    flights: [],
    foodItems: [],
    seatTypes: [],
    streamingServices: [],
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      const flightsResponse = await fetch('http://localhost:5000/available_flights');
      const flightsData = await flightsResponse.json();
      
      const foodItemsResponse = await fetch('http://localhost:5000/list_food_items');
      const foodItemsData = await foodItemsResponse.json();
      
      const seatTypesResponse = await fetch('http://localhost:5000/list_seat_types');
      const seatTypesData = await seatTypesResponse.json();
      
      const streamingServicesResponse = await fetch('http://localhost:5000/list_streaming_services');
      const streamingServicesData = await streamingServicesResponse.json();
      
      setData({
        flights: flightsData,
        foodItems: foodItemsData,
        seatTypes: seatTypesData,
        streamingServices: streamingServicesData,
      });
    };

    fetchData();
  }, []);


  const total = cart ? calculateTotal(cart, data.flights, data.foodItems, data.seatTypes, data.streamingServices) : '0.00';



  // Render the component
  return (
    <div className="container">
      {/* Render selection inputs here, update state on change */}
      {/* Display the total price using the `total` variable */}
      <div>Total Price: ${total}</div>
    </div>
  );
};

export default CalculationComponent;
