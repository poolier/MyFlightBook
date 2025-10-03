import React, { useState, useEffect } from "react";
import axios from "axios";


function StatMini() {
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
            const response = await axios.get(`https://lolprostat.com:8088/Flight/flightStatDemo?email=test@test.test`);
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
            const response = await axios.get("https://lolprostat.com:8088/Flight/airports");
            setAirports(response.data.airports);
            console.log("Airports fetched successfully:", response.data.airports);
            return true;
        } catch (error) {
            console.error("Error fetching airports:", error);
            setError("Failed to fetch airports");
            return false;
        }
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

            <div className="flight-stats-container">
                <div className="stats-header">
                    <h1>Statistiques de Vol</h1>
                    
                </div>

                <div className="stats-grid-ver">
                    <div className="stat-card-ver">
                        <div className="stat-icon-ver">✈️</div>
                        <div className="stat-content">
                            <h3 style={{color:"#2c3e50"}}>Vols Totaux</h3>
                            <p className="stat-number-ver">{userFlights.length}</p>
                            <span className="stat-change positive">+{flightCount} ce mois</span>
                        </div>
                    </div>

                    <div className="stat-card-ver">
                        <div className="stat-icon-ver">⏱️</div>
                        <div className="stat-content">
                            <h3 style={{color:"#2c3e50"}}>Heures de Vol</h3>
                            <p className="stat-number-ver">{time.toFixed(0)}h</p>
                            <span className="stat-change positive">+{time30d.toFixed(0)}h ce mois</span>
                        </div>
                    </div>

                    <div className="stat-card-ver">
                        <div className="stat-icon-ver">🌍</div>
                        <div className="stat-content">
                            <h3 style={{color:"#2c3e50"}}>Distance Parcourue</h3>
                            <p className="stat-number-ver">{formatNumberWithSpace(distance)} km</p>
                            <span className="stat-change positive">+{formatNumberWithSpace(distance30d)} km ce mois</span>
                        </div>
                    </div>

                    <div className="stat-card-ver">
                        <div className="stat-icon-ver">🛬</div>
                        <div className="stat-content">
                            <h3 style={{color:"#2c3e50"}}>Aéroports découverts</h3>
                            <p className="stat-number-ver">{airportUser.size}</p>
                            <span className="stat-change positive"></span>
                        </div>
                    </div>

                    <div className="stat-card-ver">
                        <div className="stat-icon-ver">💺</div>
                        <div className="stat-content">
                            <h3 style={{color:"#2c3e50"}}>Compagnies empruntées</h3>
                            <p className="stat-number-ver">{airlineUser.size}</p>
                            <span className="stat-change positive"></span>
                        </div>
                    </div>
                </div>

                <div className="charts-section" style={{gap:"0px", gridTemplateColumns:"1fr 0fr"}}>
                    {/* <div className="chart-container">
                        <h3>Vols par Mois</h3>
                        <div className="bar-chart">
                            <div className="bar-item"><div className="bar" title="4 vols" style={{ height: "50%" }}></div><span className="bar-label">Jan</span></div>
                            <div className="bar-item"><div className="bar" title="3 vols" style={{ height: "50%" }}></div><span className="bar-label">Fév</span></div>
                            <div className="bar-item"><div className="bar" title="5 vols" style={{ height: "50%" }}></div><span className="bar-label">Mar</span></div>
                            <div className="bar-item"><div className="bar" title="2 vols" style={{ height: "50%" }}></div><span className="bar-label">Avr</span></div>
                            <div className="bar-item"><div className="bar" title="6 vols" style={{ height: "50%" }}></div><span className="bar-label">Mai</span></div>
                            <div className="bar-item"><div className="bar" title="4 vols" style={{ height: "50%" }}></div><span className="bar-label">Jun</span></div>
                            <div className="bar-item"><div className="bar" title="8 vols" style={{ height: "50%" }}></div><span className="bar-label">Jul</span></div>
                            <div className="bar-item"><div className="bar" title="7 vols" style={{ height: "50%" }}></div><span className="bar-label">Aoû</span></div>
                            <div className="bar-item"><div className="bar" title="3 vols" style={{ height: "50%" }}></div><span className="bar-label">Sep</span></div>
                            <div className="bar-item"><div className="bar" title="5 vols" style={{ height: "50%" }}></div><span className="bar-label">Oct</span></div>
                            <div className="bar-item"><div className="bar" title="6 vols" style={{ height: "50%" }}></div><span className="bar-label">Nov</span></div>
                            <div className="bar-item"><div className="bar" title="4 vols" style={{ height: "50%" }}></div><span className="bar-label">Déc</span></div>
                        </div>
                    </div> */}

                    <div className="additional-stats">
                        <h3>Statistiques Détaillées</h3>
                        <div className="detail-stats">
                            <div className="detail-item"><span className="detail-label">Durée moyenne de vol</span><span className="detail-value">{formatHoursToHoursMinutes(timeM)}</span></div>
                            <div className="detail-item"><span className="detail-label">Vol le plus long</span><span className="detail-value">{formatHoursToHoursMinutes(timePL)}</span></div>
                            <div className="detail-item"><span className="detail-label">Destination favorite</span><span className="detail-value">{mostUsedAirports.length > 0 ? mostUsedAirports[1].code : 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Distance moyenne par vol</span><span className="detail-value">{formatNumberWithSpace(distanceM)} km</span></div>
                        </div>
                    </div>
                </div>

                <div className="extended-stats">
                    <div className="stat-section">
                        <h3>🏢 Compagnies Aériennes Préférées</h3>
                        <div className="ranking-list">
                            {mostUsedAirlines.map((airline, index) => (
                                <div className="ranking-item" key={index}>
                                    <div className="ranking-info">
                                        <span className="ranking-position">#{index + 1}</span>
                                        <span className="ranking-name">{airline.name}</span>
                                    </div>
                                    <div className="ranking-stats">
                                        <span className="ranking-count">{airline.count} vols</span>
                                        <div className="ranking-bar">
                                            <div className="ranking-fill" style={{ width: `${(airline.count / mostUsedAirlines[0].count) * 100}%` }}></div>
                                        </div>
                                        <span className="ranking-percentage">{((airline.count / userFlights.length) * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="stat-section">
                        <h3>🛫 Aéroports les Plus Empruntés</h3>
                        <div className="airport-grid">
                            {mostUsedAirports.map((airport, index) => (
                                <div className="airport-card" key={index}>
                                    <div className="airport-header">
                                        <span className="airport-code">{airport.code}</span>
                                        <span className="airport-type hub">{index === 0 ? 'hub' : 'APT'}</span>
                                    </div>
                                    <div className="airport-name">{airports.find(a => a.iata_code === airport.code)?.name || 'Unknown'}</div>
                                    <div className="airport-flights">{airport.count} vols</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="stat-section">
                        <h3>💺 Classes de Voyage</h3>
                        <div className="class-distribution">
                            <div className="class-item">
                                <div
                                    className="class-circle"
                                    style={{
                                        background: "conic-gradient(rgb(52, 152, 219) 0deg, rgb(52, 152, 219) 214.56deg, rgb(52, 152, 219) 214.56deg, rgb(52, 152, 219) 360deg)"
                                    }}
                                >
                                    <div className="class-inner">
                                        <span className="class-percentage">100%</span>
                                    </div>
                                </div>
                                <div className="class-info">
                                    <span className="class-name">Économique</span>
                                    <span className="class-count">{userFlights.length} vols</span>
                                </div>
                            </div>

                            <div className="class-item">
                                <div
                                    className="class-circle"
                                    style={{
                                        background: "conic-gradient(rgb(236, 240, 241) 0deg, rgb(236, 240, 241) 214.56deg, rgb(236, 240, 241) 214.56deg, rgb(236, 240, 241) 360deg)"
                                    }}
                                >
                                    <div className="class-inner">
                                        <span className="class-percentage">0%</span>
                                    </div>
                                </div>
                                <div className="class-info">
                                    <span className="class-name">Premium Eco</span>
                                    <span className="class-count">0 vols</span>
                                </div>
                            </div>

                            <div className="class-item">
                                <div
                                    className="class-circle"
                                    style={{
                                        background: "conic-gradient(rgb(236, 240, 241) 0deg, rgb(236, 240, 241) 214.56deg, rgb(236, 240, 241) 214.56deg, rgb(236, 240, 241) 360deg)"
                                    }}
                                >
                                    <div className="class-inner">
                                        <span className="class-percentage">0%</span>
                                    </div>
                                </div>
                                <div className="class-info">
                                    <span className="class-name">Business</span>
                                    <span className="class-count">0 vols</span>
                                </div>
                            </div>

                            <div className="class-item">
                                <div
                                    className="class-circle"
                                    style={{
                                        background: "conic-gradient(rgb(236, 240, 241) 0deg, rgb(236, 240, 241) 214.56deg, rgb(236, 240, 241) 214.56deg, rgb(236, 240, 241) 360deg)"
                                    }}
                                >
                                    <div className="class-inner">
                                        <span className="class-percentage">0%</span>
                                    </div>
                                </div>
                                <div className="class-info">
                                    <span className="class-name">Première</span>
                                    <span className="class-count">0 vols</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="achievements">
                    <h3>🏆 Réalisations</h3>
                    <div className="achievement-grid">
                        <div className={`achievement-item ${airportUser.size>19 ? 'earned' : ''}`}>
                            <div className="achievement-icon">🏆</div>
                            <div className="achievement-content"><h4>Globe-trotter</h4><p>Visité 20+ destinations</p></div>
                        </div>

                        <div className={`achievement-item ${time>99 ? 'earned' : ''}`}>
                            <div className="achievement-icon">⭐</div>
                            <div className="achievement-content"><h4>Pilote Expérimenté</h4><p>100+ heures de vol</p></div>
                        </div>

                        {/* <div className={`achievement-item ${isEarned ? 'earned' : ''}`}>
                            <div className="achievement-icon">🛫</div>
                            <div className="achievement-content"><h4>Fidèle Voyageur</h4><p>10+ vols avec Air France</p></div>
                        </div> */}

                        <div className={`achievement-item ${userFlights.length >49 ? 'earned' : ''}`}>
                            <div className="achievement-icon">🌟</div>
                            <div className="achievement-content"><h4>Voyageur Fréquent</h4><p>50 vols</p></div>
                        </div>

                        <div className={`achievement-item ${distance > 40000 ? 'earned' : ''}`}>
                            <div className="achievement-icon">🎯</div>
                            <div className="achievement-content"><h4>Tour du Monde</h4><p>40,000 km </p></div>
                        </div>

                        <div className={`achievement-item ${distance >440000 ? 'earned' : ''}`}>
                            <div className="achievement-icon">🌑</div>
                            <div className="achievement-content"><h4>Moon</h4><p>440,000km</p></div>
                        </div>

                        <div className={`achievement-item ${airportUser.size>49 ? 'earned' : ''}`}>
                            <div className="achievement-icon">🌍</div>
                            <div className="achievement-content"><h4>Explorateur</h4><p>Visiter 50 destinations</p></div>
                        </div>
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
                <br />
                <br />
            </div>
        </div>
    );
}

export default StatMini;
