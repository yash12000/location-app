import React, { useState, useEffect } from "react";
import axios from "axios";

function LocationSelector() {
  // State variables to store countries, states, cities, and the selected values
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [message, setMessage] = useState("");

  // Fetch all countries on initial render
  useEffect(() => {
    axios
      .get("https://crio-location-selector.onrender.com/countries")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
        )
        .then((response) => {
          setStates(response.data);
          setCities([]);
          setSelectedState("");
          setSelectedCity("");
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (selectedState) {
      axios
        .get(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
        )
        .then((response) => {
          setCities(response.data);
          setSelectedCity("");
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    }
  }, [selectedState, selectedCountry]);

  // Automatically display the message when a city is selected
  useEffect(() => {
    if (selectedCity) {
      setMessage(
        `You Selected ${selectedCity}, ${selectedState}, ${selectedCountry}`
      );
    }
  }, [selectedCity, selectedState, selectedCountry]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Select Location</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
        {/* Country Dropdown */}
        <div>
          <label style={{ marginBottom: "10px", display: "block" }}>
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            required
            style={{ padding: "10px", width: "200px", fontSize: "16px" }}
          >
            <option value="">Select Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* State Dropdown - Enabled only if a country is selected */}
        <div>
          <label style={{ marginBottom: "10px", display: "block" }}>
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            disabled={!selectedCountry}
            required
            style={{ padding: "10px", width: "200px", fontSize: "16px" }}
          >
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* City Dropdown - Enabled only if a state is selected */}
        <div>
          <label style={{ marginBottom: "10px", display: "block" }}>
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
            required
            style={{ padding: "10px", width: "200px", fontSize: "16px" }}
          >
            <option value="">Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message after selection */}
      {message && <h3 style={{ marginTop: "20px" }}>{message}</h3>}
    </div>
  );
}

export default LocationSelector;
