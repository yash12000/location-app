import React, { useState, useEffect } from "react";
import axios from "axios";

function LocationSelector() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [message, setMessage] = useState("");

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

  useEffect(() => {
    if (selectedCity) {
      setMessage(
        `You Selected ${selectedCity}, ${selectedState}, ${selectedCountry}`
      );
    } else if (selectedState && selectedCountry) {
      setMessage(`You Selected ${selectedState}, ${selectedCountry}`);
    } else if (selectedCountry) {
      setMessage(`You Selected ${selectedCountry}`);
    } else {
      setMessage("");
    }
  }, [selectedCity, selectedState, selectedCountry]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Select Location</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
        <div>
          <label style={{ marginBottom: "10px", display: "block" }}>
            Select Country:
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

        <div>
          <label style={{ marginBottom: "10px", display: "block" }}>
            Select State:
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

        <div>
          <label style={{ marginBottom: "10px", display: "block" }}>
            Select City:
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

      {message && <h3 style={{ marginTop: "20px" }}>{message}</h3>}
    </div>
  );
}

export default LocationSelector;
