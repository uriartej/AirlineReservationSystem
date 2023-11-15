import React from 'react';
import './App.css';
import AvailableFlights from './AvailableFlights';
// Import the CreateFlightForm component
import CreateFlightForm from './CreateFlightForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Flight It Your Way</h1>
      </header>
      <main>
        <CreateFlightForm />
        <AvailableFlights />
      </main>
    </div>
  );
}

export default App;
