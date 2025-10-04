import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import Navbar from "./navbar";
import axios from "axios";

function Home() {
  const globeEl = useRef();
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [filteredDepartureAirports, setFilteredDepartureAirports] = useState([]);
  const [filteredArrivalAirports, setFilteredArrivalAirports] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [selectedArrival, setSelectedArrival] = useState(null);
  const [departureSearch, setDepartureSearch] = useState("");
  const [arrivalSearch, setArrivalSearch] = useState("");
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showArrivalDropdown, setShowArrivalDropdown] = useState(false);
  const [userFlights, setUserFlights] = useState([]);
  const [selectedFlights, setSelectedFlights] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [visitedAirports, setVisitedAirports] = useState([]);
  const [showAirportPopup, setShowAirportPopup] = useState(false);
  const [selectedAirportFlights, setSelectedAirportFlights] = useState([]);
  const [selectedAirportInfo, setSelectedAirportInfo] = useState(null);
  const [friendlist, setFriendlist] = useState([]);
  const [friendFlightsArcs, setFriendFlightsArcs] = useState([]);
  const [showFriendSelection, setShowFriendSelection] = useState(false);

  const fetchUserFlights = async () => {
    const userToken = localStorage.getItem('token');
    if (!userToken) return;

    try {
      const response = await axios.get(`https://api.flight.lolprostat.com/user-flights?token=${userToken}`);
      setUserFlights(response.data.flights);
      console.log("User flights fetched successfully:", response.data.flights);
    } catch (error) {
      console.error("Error fetching user flights:", error);
    }
  };

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await axios.get("https://api.flight.lolprostat.com/airports");
        setAirports(response.data.airports);
        console.log("Airports fetched successfully:", response.data.airports);
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    };

    const fetchFriendList = async () => {
      const userToken = localStorage.getItem('token');
      if (!userToken) return;
      try {
        const response = await axios.get(`https://api.flight.lolprostat.com/friendList?token=${userToken}`);
        setFriendlist(response.data.friends);
        console.log("Liste d'amis:", response.data.friends);
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    };

    fetchAirports();
    fetchUserFlights();
    fetchFriendList();
  }, []);

  useEffect(() => {
    if (departureSearch.length > 2) {
      const filtered = airports.filter(airport =>
        airport.name.toLowerCase().includes(departureSearch.toLowerCase()) ||
        airport.municipality.toLowerCase().includes(departureSearch.toLowerCase()) ||
        airport.iata_code.toLowerCase().includes(departureSearch.toLowerCase())
      );
      setFilteredDepartureAirports(filtered);
    } else {
      setFilteredDepartureAirports([]);
    }
  }, [departureSearch, airports]);

  useEffect(() => {
    if (arrivalSearch.length > 2) {
      const filtered = airports.filter(airport =>
        airport.name.toLowerCase().includes(arrivalSearch.toLowerCase()) ||
        airport.municipality.toLowerCase().includes(arrivalSearch.toLowerCase()) ||
        airport.iata_code.toLowerCase().includes(arrivalSearch.toLowerCase())
      );
      setFilteredArrivalAirports(filtered);
    } else {
      setFilteredArrivalAirports([]);
    }
  }, [arrivalSearch, airports]);

  const convertFlightsToArcs = (flights, airports, color = ["red", "red"]) => {
    const arcsMap = new Map();
    const visited = new Set();

    flights.forEach(flight => {
      const departureAirport = airports.find(airport => airport.iata_code === flight.airport_from);
      const arrivalAirport = airports.find(airport => airport.iata_code === flight.airport_to);

      if (departureAirport) {
        visited.add(departureAirport.iata_code);
      }
      if (arrivalAirport) {
        visited.add(arrivalAirport.iata_code);
      }

      if (departureAirport && arrivalAirport) {
        const arcKey = [departureAirport.iata_code, arrivalAirport.iata_code].sort().join('-');

        if (!arcsMap.has(arcKey)) {
          arcsMap.set(arcKey, {
            startLat: parseFloat(departureAirport.latitude_deg),
            startLng: parseFloat(departureAirport.longitude_deg),
            endLat: parseFloat(arrivalAirport.latitude_deg),
            endLng: parseFloat(arrivalAirport.longitude_deg),
            color: color,
            flights: [flight]
          });
        } else {
          const existingArc = arcsMap.get(arcKey);
          existingArc.flights.push(flight);
        }
      }
    });

    // Convert visited airports to points data with additional info
    const visitedAirportsData = Array.from(visited).map(iata_code => {
      const airport = airports.find(a => a.iata_code === iata_code);
      return airport ? {
        lat: parseFloat(airport.latitude_deg),
        lng: parseFloat(airport.longitude_deg),
        size: 0.5,
        color: "green", // Toujours vert pour les points
        iata_code: airport.iata_code,
        name: airport.name,
        municipality: airport.municipality
      } : null;
    }).filter(Boolean);

    setVisitedAirports(prev => [...prev, ...visitedAirportsData]);

    return Array.from(arcsMap.values());
  };

  const [arcsData, setArcsData] = useState([]);

  useEffect(() => {
    if (userFlights.length > 0 && airports.length > 0) {
      const arcsFromFlights = convertFlightsToArcs(userFlights, airports);
      setArcsData(arcsFromFlights);
    }
  }, [userFlights, airports]);

  const handleAddFlightClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedDeparture(null);
    setSelectedArrival(null);
    setDepartureSearch("");
    setArrivalSearch("");
  };

  const handleOpenFilter = () => {
    setShowFilter(true);
  };

  const handlerCloseFilter = () => {
    setShowFilter(false);
  };

  const handleDepartureSelect = (airport) => {
    setSelectedDeparture(airport);
    setDepartureSearch(`${airport.name} (${airport.iata_code}), ${airport.municipality}`);
    setShowDepartureDropdown(false);
  };

  const handleArrivalSelect = (airport) => {
    setSelectedArrival(airport);
    setArrivalSearch(`${airport.name} (${airport.iata_code}), ${airport.municipality}`);
    setShowArrivalDropdown(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userToken = localStorage.getItem('token');

    if (!selectedDeparture || !selectedArrival) {
      alert("Please select both departure and arrival airports");
      return;
    }

    const formData = {
      airport_from: selectedDeparture.iata_code,
      airport_to: selectedArrival.iata_code,
      flight_date: event.target.date.value,
      flight_number: event.target.flightNumber.value,
      airline: event.target.airline.value,
      token: userToken
    };

    try {
      const response = await axios.post("https://api.flight.lolprostat.com/flights", formData);
      console.log("Flight added successfully:", response.data);

      await fetchUserFlights();

      setShowForm(false);
      setSelectedDeparture(null);
      setSelectedArrival(null);
      setDepartureSearch("");
      setArrivalSearch("");
    } catch (error) {
      console.error("Error adding flight:", error);
    }
  };

  const handleArcClick = (arc) => {
    setSelectedFlights(arc.flights);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedFlights([]);
  };

  const handlePointClick = (point) => {
    // Find all flights that involve this airport (either as departure or arrival)
    const airportFlights = userFlights.filter(flight =>
      flight.airport_from === point.iata_code || flight.airport_to === point.iata_code
    );

    setSelectedAirportFlights(airportFlights);
    setSelectedAirportInfo({
      name: point.name,
      iata_code: point.iata_code,
      municipality: point.municipality
    });
    setShowAirportPopup(true);
  };

  const handleCloseAirportPopup = () => {
    setShowAirportPopup(false);
    setSelectedAirportFlights([]);
    setSelectedAirportInfo(null);
  };

  const handleFriendFlightsClick = () => {
    setShowFriendSelection(true);
  };

  const handleFriendSelect = async (friendEmail) => {
    const userToken = localStorage.getItem('token');
    if (!userToken) return;

    try {
      const response = await axios.get(`https://api.flight.lolprostat.com/flightFriend?token=${userToken}&email_two=${friendEmail}`);
      const friendFlights = response.data.flights;
      console.log("Friend flights fetched successfully:", friendFlights);

      const arcsFromFriendFlights = convertFlightsToArcs(friendFlights, airports, ["yellow", "yellow"]);
      setFriendFlightsArcs(arcsFromFriendFlights);
      setShowFriendSelection(false);
    } catch (error) {
      console.error("Error fetching friend flights:", error);
    }
  };

  const handleCloseFriendSelection = () => {
    setShowFriendSelection(false);
  };

  const handleClearFriendFlights = () => {
    setFriendFlightsArcs([]);
    setShowFriendSelection(false);
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="home-main" style={{ backgroundColor: "#000", height: "100vh", overflow: "hidden" }}>
        <div className="map-controls" style={{ marginTop: "75px" }}>
          <button
            className="btn-icon"
            type="button"
            onClick={handleAddFlightClick}
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="radix-«r1s»"
            data-state="closed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-plus">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </button>
          <button className="btn-icon" onClick={handleFriendFlightsClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-plus">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </button>
          <button className="btn-icon" onClick={handleOpenFilter}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-filter">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        </div>
        <Globe
          ref={globeEl}
          arcsData={[...arcsData, ...friendFlightsArcs]}
          arcColor={"color"}
          arcAltitude={0.2}
          arcStroke={0.5}
          arcAltitudeAutoScale={1.1}
          arcDashLength={0}
          arcDashGap={0}
          arcDashInitialGap={0}
          arcDashAnimateTime={0}
          globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
          backgroundColor="#000"
          onArcClick={handleArcClick}
          pointsData={visitedAirports}
          pointColor="color"
          pointAltitude={0.01}
          pointSize="size"
          onPointClick={handlePointClick}
        />

        {showForm && (
          <div className="form-overlay">
            <div className="flight-form-container">
              <div className="flight-form-header">
                <h2>Add New Flight</h2>
                <button className="close-button" onClick={handleCloseForm}>×</button>
              </div>
              <form className="flight-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="departure">Departure Airport</label>
                  <div className="custom-select">
                    <input
                      id="departure"
                      type="text"
                      value={departureSearch}
                      onChange={(e) => {
                        setDepartureSearch(e.target.value);
                        setShowDepartureDropdown(true);
                      }}
                      onFocus={() => departureSearch.length > 0 && setShowDepartureDropdown(true)}
                      placeholder="Search for departure airport..."
                      required
                    />
                    {showDepartureDropdown && filteredDepartureAirports.length > 0 && (
                      <ul className="dropdown-list">
                        {filteredDepartureAirports.map((airport) => (
                          <li
                            key={airport.iata_code}
                            onClick={() => handleDepartureSelect(airport)}
                          >
                            {airport.name} ({airport.iata_code}), {airport.municipality}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="arrival">Arrival Airport</label>
                  <div className="custom-select">
                    <input
                      id="arrival"
                      type="text"
                      value={arrivalSearch}
                      onChange={(e) => {
                        setArrivalSearch(e.target.value);
                        setShowArrivalDropdown(true);
                      }}
                      onFocus={() => arrivalSearch.length > 0 && setShowArrivalDropdown(true)}
                      placeholder="Search for arrival airport..."
                      required
                    />
                    {showArrivalDropdown && filteredArrivalAirports.length > 0 && (
                      <ul className="dropdown-list">
                        {filteredArrivalAirports.map((airport) => (
                          <li
                            key={airport.iata_code}
                            onClick={() => handleArrivalSelect(airport)}
                          >
                            {airport.name} ({airport.iata_code}), {airport.municipality}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="date">Flight Date</label>
                  <input id="date" required="" type="date" name="date"></input>
                </div>
                <div className="form-group">
                  <label htmlFor="airline">Airline</label>
                  <input id="airline" required="" placeholder="e.g. Air France" type="text" name="airline"></input>
                </div>
                <div className="form-group">
                  <label htmlFor="flightNumber">Flight Number</label>
                  <input id="flightNumber" required="" placeholder="e.g. AF123" type="text" name="flightNumber"></input>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={handleCloseForm}>Cancel</button>
                  <button type="submit" className="submit-button">Add Flight</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showFilter && (
          <div className="form-overlay">
            <div className="flight-form-container">
              <div className="flight-form-header">
                <h2>Filters</h2>
                <button className="close-button" onClick={handlerCloseFilter}>×</button>
              </div>
            </div>
          </div>
        )}

        {showPopup && selectedFlights && (
          <div className="popup-overlay">
            <div className="popup-container">
              <div className="popup-header">
                <h2>Flights Details</h2>
                <button className="close-button" onClick={handleClosePopup}>×</button>
              </div>
              <div className="popup-content">
                <p><strong>Number of flights:</strong> {selectedFlights.length}</p>
                <div className="flights-list">
                  {selectedFlights.map((flight, index) => (
                    <div key={index} className="flight-item">
                      <p><strong>Departure:</strong> {flight.airport_from}</p>
                      <p><strong>Arrival:</strong> {flight.airport_to}</p>
                      <p><strong>Date:</strong> {flight.flight_date}</p>
                      <p><strong>Flight Number:</strong> {flight.flight_number}</p>
                      <p><strong>Airline:</strong> {flight.airline}</p>
                      {index < selectedFlights.length - 1 && <hr />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {showAirportPopup && selectedAirportInfo && (
          <div className="popup-overlay">
            <div className="popup-container">
              <div className="popup-header">
                <h2>Flights from/to {selectedAirportInfo.name}</h2>
                <button className="close-button" onClick={handleCloseAirportPopup}>×</button>
              </div>
              <div className="popup-content">
                <p><strong>Airport:</strong> {selectedAirportInfo.name} ({selectedAirportInfo.iata_code})</p>
                <p><strong>Location:</strong> {selectedAirportInfo.municipality}</p>
                <p><strong>Number of flights:</strong> {selectedAirportFlights.length}</p>
                <div className="flights-list">
                  {selectedAirportFlights.map((flight, index) => (
                    <div key={index} className="flight-item">
                      <p><strong>Type:</strong> {flight.airport_from === selectedAirportInfo.iata_code ? "Departure" : "Arrival"}</p>
                      <p><strong>{flight.airport_from === selectedAirportInfo.iata_code ? "To:" : "From:"}</strong> {flight.airport_from === selectedAirportInfo.iata_code ? flight.airport_to : flight.airport_from}</p>
                      <p><strong>Date:</strong> {flight.flight_date}</p>
                      <p><strong>Flight Number:</strong> {flight.flight_number}</p>
                      <p><strong>Airline:</strong> {flight.airline}</p>
                      {index < selectedAirportFlights.length - 1 && <hr />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {showFriendSelection && (
          <div className="popup-overlay">
            <div className="popup-container">
              <div className="popup-header">
                <h2>Select a Friend</h2>
                <button className="close-button" onClick={handleCloseFriendSelection}>×</button>
              </div>
              <div className="popup-content">
                <div className="friends-list">
                  {friendlist.map((friend, index) => (
                    <div key={index} className="friend-item">
                      <button className="button-black" onClick={() => handleFriendSelect(friend["email_two"])}>
                        {friend["email_two"]}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="form-actions" style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleClearFriendFlights}
                    style={{ width: '100%' }}
                  >
                    Clear Friend Flights
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
