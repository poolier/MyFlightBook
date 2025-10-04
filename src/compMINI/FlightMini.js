import React, { useState, useEffect } from "react";
import axios from "axios";


function FlightMini() {
    const [airports, setAirports] = useState([]);
    const [userFlights, setUserFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flightCount, setFlightCount] = useState(0);
    const [time, setTime] = useState(0);
    const [distance, setDistance] = useState(0);
    const [timeM, setTimeM] = useState(0);
    const [timePL, setTimePL] = useState(0);
    const [distanceM, setDistanceM] = useState(0);
    const [time30d, setTime30d] = useState(0);
    const [distance30d, setDistance30d] = useState(0);
    const [airportUser, setAirportUser] = useState(new Set());
    const [airlineUser, setAirlineUser] = useState(new Set());
    const [mostUsedAirports, setMostUsedAirports] = useState([]);
    const [mostUsedAirlines, setMostUsedAirlines] = useState([]);

    const fetchUserFlights = async () => {
        

        try {
            const response = await axios.get(`https://api.flight.lolprostat.com/flightStatDemo?email=test@test.test`);
            console.log("User flights fetched successfully:", response.data.flights);
            return response.data.flights;
        } catch (error) {
            console.error("Error fetching user flights:", error);
            setError("Failed to fetch user flights");
            return null;
        }
    };

    const fetchAirports = async () => {
        try {
            const response = await axios.get("https://api.flight.lolprostat.com/airports");
            setAirports(response.data.airports);
            console.log("Airports fetched successfully:", response.data.airports);
            return true;
        } catch (error) {
            console.error("Error fetching airports:", error);
            setError("Failed to fetch airports");
            return false;
        }
    };

    const sortFlights = (flights) => {
        return flights.slice().sort((a, b) => {
            // First, sort by airline
            // const airlineComparison = a.airline.localeCompare(b.airline);
            // if (airlineComparison !== 0) {
            //     return airlineComparison;
            // }
            // If airlines are the same, sort by flight_date in descending order
            return new Date(b.flight_date) - new Date(a.flight_date);
        });
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const flightsData = await fetchUserFlights();
                const airportsSuccess = await fetchAirports();

                if (flightsData && airportsSuccess) {
                    console.log("All data loaded successfully");
                    setUserFlights(flightsData);

                    const currentDate = new Date();
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

                    const recentFlights = flightsData.filter(flight => {
                        const flightDate = new Date(flight.flight_date);
                        return flightDate >= thirtyDaysAgo && flightDate <= currentDate;
                    });
                    console.log('recentflight', recentFlights)

                    setFlightCount(recentFlights.length);

                    let sumDistance = 0;
                    let sumHours = 0;
                    let nbrVol = 0;
                    let timeVolPlusLong = 0;

                    for (const key in flightsData) {
                        sumDistance += flightsData[key]['distance_km'];
                        sumHours += flightsData[key]['estimated_flight_time_hours'];
                        nbrVol += 1;

                        if (timeVolPlusLong < flightsData[key]['estimated_flight_time_hours']) {
                            timeVolPlusLong = flightsData[key]['estimated_flight_time_hours'];
                        }
                    }

                    setTime(sumHours);
                    setDistance(sumDistance);
                    setTimeM(sumHours / nbrVol);
                    setDistanceM(sumDistance / nbrVol);
                    setTimePL(timeVolPlusLong);

                    let sumDistance30d = 0;
                    let sumHours30d = 0;

                    for (const key in recentFlights) {
                        sumDistance30d += recentFlights[key]['distance_km'];
                        sumHours30d += recentFlights[key]['estimated_flight_time_hours'];
                    }

                    setTime30d(sumHours30d);
                    setDistance30d(sumDistance30d);

                    // Collect all unique airports
                    const airportss = new Set();
                    flightsData.forEach(flight => {
                        airportss.add(flight.airport_from);
                        airportss.add(flight.airport_to);
                    });

                    setAirportUser(airportss);

                    // Collect all unique airlines
                    const airlines = new Set();
                    flightsData.forEach(flight => {
                        airlines.add(flight.airline);
                    });

                    setAirlineUser(airlines);

                    // Créer un objet pour compter les occurrences de chaque aéroport
                    const airportCounts = {};

                    // Parcourir chaque vol et compter les aéroports
                    flightsData.forEach(flight => {
                        const fromAirport = flight.airport_from;
                        const toAirport = flight.airport_to;

                        // Incrémenter le compteur pour l'aéroport de départ
                        if (airportCounts[fromAirport]) {
                            airportCounts[fromAirport]++;
                        } else {
                            airportCounts[fromAirport] = 1;
                        }

                        // Incrémenter le compteur pour l'aéroport d'arrivée
                        if (airportCounts[toAirport]) {
                            airportCounts[toAirport]++;
                        } else {
                            airportCounts[toAirport] = 1;
                        }
                    });

                    // Convertir l'objet en tableau et trier par nombre d'occurrences
                    const sortedAirports = Object.entries(airportCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 10)
                        .map(([code, count]) => ({ code, count }));

                    setMostUsedAirports(sortedAirports);

                    // Créer un objet pour compter les occurrences de chaque compagnie aérienne
                    const airlineCounts = {};

                    // Parcourir chaque vol et compter les compagnies aériennes
                    flightsData.forEach(flight => {
                        const airline = flight.airline;

                        // Incrémenter le compteur pour la compagnie aérienne
                        if (airlineCounts[airline]) {
                            airlineCounts[airline]++;
                        } else {
                            airlineCounts[airline] = 1;
                        }
                    });

                    // Convertir l'objet en tableau et trier par nombre d'occurrences
                    const sortedAirlines = Object.entries(airlineCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 100)
                        .map(([name, count]) => ({ name, count }));

                    setMostUsedAirlines(sortedAirlines);
                }
            } catch (err) {
                setError("An error occurred while loading data");
                console.error("Error in loading data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    function formatNumberWithSpace(number) {
        return number.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    function formatHoursToHoursMinutes(decimalHours) {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        return `${hours}h ${minutes}m`;
    }

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="loading-container" style={{backgroundColor:"#f8f9fa",width:"100%", color:"black"}}>

                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container" style={{backgroundColor:"#f8f9fa",width:"100%", color:"black"}}>

                <div className="error-message">
                    <p>Erreur lors du chargement des données : {error}</p>
                    <button onClick={() => window.location.reload()}>Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container" style={{overflow:"auto", width:"100%", paddingTop:"140px", backgroundColor:"#f8f9fa"}}>

            <div className="flight-list-container">
                <div className="flight-list-header">
                    <div className="header-content-flist">
                        <h1>Mes Vols</h1>
                        <p>{userFlights.length} vols • Votre historique</p>
                    </div>
                    <div className="header-actions-flist">
                        <button className="filter-btn-flist">
                            <span className="btn-icon-flist">🔍</span>Filtres
                        </button>
                        <button className="friends-btn-flist">
                            <span className="btn-icon-flist">👥</span>Vols des amis
                        </button>
                    </div>
                </div>

                <div className="flight-stats-summary">
                    <div className="stat-summary-item">
                        <span className="stat-summary-icon">✈️</span>
                        <div className="stat-summary-content">
                            <span className="stat-summary-value">{userFlights.length}</span>
                            <span className="stat-summary-label">Vols</span>
                        </div>
                    </div>
                    <div className="stat-summary-item">
                        <span className="stat-summary-icon">🕒</span>
                        <div className="stat-summary-content">
                            <span className="stat-summary-value">{formatHoursToHoursMinutes(time)}</span>
                            <span className="stat-summary-label">Temps de vol</span>
                        </div>
                    </div>
                    <div className="stat-summary-item">
                        <span className="stat-summary-icon">🌍</span>
                        <div className="stat-summary-content">
                            <span className="stat-summary-value">{formatNumberWithSpace(distance)} km</span>
                            <span className="stat-summary-label">Distance</span>
                        </div>
                    </div>
                </div>

                <div className="flight-list">
                    {sortFlights(userFlights).map((flight, index) => (
                        <div className="flight-card" key={index}>
                            <div className="flight-header">
                                <div className="flight-airline">
                                    <span className="airline-name-ffll">{flight.airline}</span>
                                    <span className="flight-number">{flight.flight_number}</span>
                                </div>
                                <div className="flight-status" style={{ backgroundColor: "rgb(52, 152, 219)" }}>Terminé</div>
                            </div>
                            <div className="flight-route">
                                <div className="flight-point departure">
                                    <div className="flight-city">
                                        {airports.find(a => a.iata_code === flight.airport_from)?.name || 'Unknown'}
                                    </div>
                                    <div className="flight-airport">{flight.airport_from}</div>
                                </div>
                                <div className="flight-path">
                                    <div className="flight-duration">
                                        {formatHoursToHoursMinutes(flight.estimated_flight_time_hours)}
                                    </div>
                                    <div className="flight-line">
                                        <div className="flight-dot"></div>
                                        <div className="flight-line-path"></div>
                                        <div className="flight-dot"></div>
                                    </div>
                                    <div className="flight-distance">
                                        {formatNumberWithSpace(flight.distance_km)} km
                                    </div>
                                </div>
                                <div className="flight-point arrival">
                                    <div className="flight-city">
                                        {airports.find(a => a.iata_code === flight.airport_to)?.name || 'Unknown'}
                                    </div>
                                    <div className="flight-airport">{flight.airport_to}</div>
                                </div>
                            </div>
                            <div className="flight-details">
                                <div className="flight-detail-item">
                                    <span className="detail-label">Avion</span>
                                    <span className="detail-value">—</span>
                                </div>
                                <div className="flight-detail-item">
                                    <span className="detail-label">Classe</span>
                                    <span className="detail-value">—</span>
                                </div>
                                <div className="flight-detail-item">
                                    <span className="detail-label">Prix</span>
                                    <span className="detail-value">—</span>
                                </div>
                                <div className="flight-detail-item">
                                    <span className="detail-label">CO₂</span>
                                    <span className="detail-value">—</span>
                                </div>
                                <div className="flight-detail-item">
                                    <span className="detail-label">Ponctualité</span>
                                    <span className="detail-value">—</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}

export default FlightMini;
