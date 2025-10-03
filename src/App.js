// src/App.js
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Globe from "react-globe.gl";
import Navbar from "./components/navbar";

import './home.css';
import Home from "./components/Home";
import HomeMini from "./compMINI/HomeMini";
import StatMini from "./compMINI/StatMini";
import FriendMini from "./compMINI/FriendMini";
import FlightMini from "./compMINI/FlightMini";

function App() {
  const globeEl = useRef();

  

  // Coordonées
  const paris = { lat: 48.8566, lng: 2.3522 };
  const newYork = { lat: 40.7128, lng: -74.006 };

  // Arc entre Paris et New York
  const arcsData = [
    {
      startLat: paris.lat,
      startLng: paris.lng,
      endLat: newYork.lat,
      endLng: newYork.lng,
      color: ["red", "RED"],
    },
  ];

  // useEffect(() => {
  //   // Zoom sur Paris au chargement
  //   if (globeEl.current) {
  //     globeEl.current.pointOfView({ lat: paris.lat, lng: paris.lng, altitude: 2 }, 3000);
  //   }
  // }, []);

  const [currentFeature, setCurrentFeature] = useState(0)
  const [selectedHero, setSelectedHero] = useState("map")


  const features = [
    {
      id: "stats",
      title: "Detailed Statistics",
      description: "Analyze your travel habits with interactive charts and comprehensive metrics.",
      image: "/placeholder.svg?height=400&width=600",
      highlights: ["Monthly charts", "Performance metrics", "Trend analysis", "Achievements"],
    },
    {
      id: "flights",
      title: "Flight History",
      description: "View all your flights with advanced filters and complete details.",
      image: "/placeholder.svg?height=400&width=600",
      highlights: ["Complete list", "Advanced filters", "Flight details", "Custom sorting"],
    },
    {
      id: "friends",
      title: "Friends Network",
      description: "Connect with other travelers and share your adventures.",
      image: "/placeholder.svg?height=400&width=600",
      highlights: ["Add friends", "Online statuses", "Friend requests", "Detailed profiles"],
    },
    {
      id: "comparison",
      title: "Statistics Comparison",
      description: "Compare your travel performance with that of your friends.",
      image: "/placeholder.svg?height=400&width=600",
      highlights: ["Comparative charts", "Smart insights", "Recommendations", "Common destinations"],
    },
  ]

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Frequent traveler",
      avatar: "👩‍💼",
      comment: "FlightTracker has helped me better understand my travel habits and optimize my trips.",
      rating: 5,
    },
    {
      name: "Pierre Martin",
      role: "International consultant",
      avatar: "👨‍💻",
      comment: "The interface is intuitive and the statistics are very detailed. Perfect for professionals.",
      rating: 5,
    },
    {
      name: "Sophie Laurent",
      role: "Digital nomad",
      avatar: "👩‍🎨",
      comment: "I love being able to compare my travels with my friends and discover new destinations.",
      rating: 5,
    },
  ]

  const stats = [
    { number: "10,000+", label: "Flights tracked" },
    { number: "2,500+", label: "Active users" },
    { number: "150+", label: "Countries visited" },
    { number: "99.9%", label: "Uptime" },
  ]

  const navigate = useNavigate();

  const onNavigate = (route) => {
    navigate(route);
  }

  const buttonSelected = (link) => {
    setSelectedHero(link);
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section2">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Track your travels with <span className="highlight">FlightTracker</span>
            </h1>
            <p className="hero-description2">
              The ultimate app for analyzing your travel habits, comparing stats with friends and
 discovering new destinations. Turn your flight data into valuable insights.
            </p>
            <div className="hero-actions">
              <button className="cta-primary" onClick={() => onNavigate("signup")}>
                Get started for free
              </button>
              <button className="cta-secondary" onClick={() => onNavigate("demo")}>
                View Demo
              </button>
            </div>
            
          </div>
          <div className="hero-visual">
            <div className="hero-dashboard">
              <div className="dashboard-header">
                <div className="dashboard-nav">
                  <div className={`nav-item ${selectedHero === "map" ? "active" : ""}`} onClick={() => buttonSelected("map")}>🌍 My Map</div>
                  <div className={`nav-item ${selectedHero === "stat" ? "active" : ""}`} onClick={() => buttonSelected("stat")}>📊 My Statistiques</div>
                  <div className={`nav-item ${selectedHero === "flight" ? "active" : ""}`} onClick={() => buttonSelected("flight")}>✈️ My Flights</div>
                  <div className={`nav-item ${selectedHero === "friend" ? "active" : ""}`} onClick={() => buttonSelected("friend")}>👥 My Friends</div>
                </div>
              </div>

              {selectedHero === "map" && (
                <div className="dashboard-content-black">
                  <HomeMini />
                </div>
              )}

              {selectedHero === "stat" && (
                <div className="dashboard-content-black">
                  <StatMini />
                </div>
              )}

              {selectedHero === "flight" && (
                <div className="dashboard-content-black">
                  <FlightMini />
                </div>
              )}

              {selectedHero === "friend" && (
                <div className="dashboard-content-black">
                  <FriendMini />
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Powerful features</h2>
          <p>Find out what FlightTracker can do for you</p>
        </div>

        <div className="features-showcase">
          <div className="features-nav">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                className={`feature-nav-item ${currentFeature === index ? "active" : ""}`}
                onClick={() => setCurrentFeature(index)}
              >
                <div className="feature-nav-title">{feature.title}</div>
                <div className="feature-nav-desc">{feature.description}</div>
              </button>
            ))}
          </div>

          <div className="feature-display">
            <div className="feature-content">
              <h3>{features[currentFeature].title}</h3>
              <p>{features[currentFeature].description}</p>
              <ul className="feature-highlights">
                {features[currentFeature].highlights.map((highlight, index) => (
                  <li key={index}>
                    <span className="highlight-icon">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
              <button className="feature-cta" onClick={() => onNavigate("signup")}>
                Try it now
              </button>
            </div>
            <div className="feature-visual">
              <div className="feature-screenshot">
                {currentFeature === 0 && (
                  <div className="stats-screenshot">
                    <div className="screenshot-header">
                      <div className="screenshot-title">Flight statistics</div>
                      <div className="screenshot-nav">
                        <span className="nav-pill active">Yearly</span>
                        <span className="nav-pill">Monthly</span>
                      </div>
                    </div>
                    <div className="screenshot-stats">
                      <div className="screenshot-stat">
                        <div className="stat-icon">✈️</div>
                        <div className="stat-value">47</div>
                        <div className="stat-label">Flights</div>
                      </div>
                      <div className="screenshot-stat">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-value">156h</div>
                        <div className="stat-label">Hours</div>
                      </div>
                      <div className="screenshot-stat">
                        <div className="stat-icon">🌍</div>
                        <div className="stat-value">89,420km</div>
                        <div className="stat-label">Distance</div>
                      </div>
                    </div>
                    <div className="screenshot-chart">
                      <div className="chart-title">Monthly trend</div>
                      <div className="chart-area">
                        <div className="chart-line"></div>
                      </div>
                    </div>
                  </div>
                )}

                {currentFeature === 1 && (
                  <div className="flights-screenshot">
                    <div className="screenshot-header">
                      <div className="screenshot-title">My Flights</div>
                      <div className="screenshot-actions">
                        <span className="action-btn">🔍 Filters</span>
                        <span className="action-btn">👥 Friends</span>
                      </div>
                    </div>
                    <div className="flight-cards">
                      <div className="flight-card-preview">
                        <div className="flight-header">
                          <span className="airline">Air France AF1234</span>
                          <span className="status completed">Done</span>
                        </div>
                        <div className="flight-route">
                          <div className="flight-point">
                            <div className="time">08:30</div>
                            <div className="city">Paris</div>
                            <div className="airport">CDG</div>
                          </div>
                          <div className="flight-path">
                            <div className="duration">8h 15m</div>
                            <div className="line">✈️</div>
                          </div>
                          <div className="flight-point">
                            <div className="time">11:45</div>
                            <div className="city">New York</div>
                            <div className="airport">JFK</div>
                          </div>
                        </div>
                      </div>
                      <div className="flight-card-preview">
                        <div className="flight-header">
                          <span className="airline">Emirates EK432</span>
                          <span className="status upcoming">Done</span>
                        </div>
                        <div className="flight-route">
                          <div className="flight-point">
                            <div className="time">02:30</div>
                            <div className="city">Dubai</div>
                            <div className="airport">DXB</div>
                          </div>
                          <div className="flight-path">
                            <div className="duration">7h 45m</div>
                            <div className="line">✈️</div>
                          </div>
                          <div className="flight-point">
                            <div className="time">14:15</div>
                            <div className="city">Singapore</div>
                            <div className="airport">SIN</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentFeature === 2 && (
                  <div className="friends-screenshot">
                    <div className="screenshot-header">
                      <div className="screenshot-title">My Friends</div>
                      <div className="screenshot-actions">
                        <span className="action-btn">👥 Add</span>
                      </div>
                    </div>
                    <div className="friends-grid">
                      <div className="friend-card-preview">
                        <div className="friend-header">
                          <div className="friend-avatar">👩‍💼</div>
                          <div className="friend-info">
                            <div className="friend-name">Marie Dubois</div>
                            <div className="friend-status online">Online</div>
                          </div>
                        </div>
                        <div className="friend-stats">
                          <div className="friend-stat">
                            <span>34</span>
                            <span>Flights</span>
                          </div>
                          <div className="friend-stat">
                            <span>127h</span>
                            <span>Hours</span>
                          </div>
                        </div>
                      </div>
                      <div className="friend-card-preview">
                        <div className="friend-header">
                          <div className="friend-avatar">👨‍💻</div>
                          <div className="friend-info">
                            <div className="friend-name">Pierre Martin</div>
                            <div className="friend-status offline">Offline</div>
                          </div>
                        </div>
                        <div className="friend-stats">
                          <div className="friend-stat">
                            <span>52</span>
                            <span>Flights</span>
                          </div>
                          <div className="friend-stat">
                            <span>198h</span>
                            <span>Hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentFeature === 3 && (
                  <div className="comparison-screenshot">
                    <div className="screenshot-header">
                      <div className="screenshot-title">Comparison</div>
                      <div className="comparison-users">
                        <span className="user">👤 You</span>
                        <span className="vs">VS</span>
                        <span className="user">👩‍💼 Marie</span>
                      </div>
                    </div>
                    <div className="comparison-stats">
                      <div className="comparison-item">
                        <div className="comparison-label">Total Flight</div>
                        <div className="comparison-bars">
                          <div className="comparison-bar my-bar" style={{ width: "80%" }}>
                            47
                          </div>
                          <div className="comparison-bar friend-bar" style={{ width: "60%" }}>
                            34
                          </div>
                        </div>
                      </div>
                      <div className="comparison-item">
                        <div className="comparison-label">Flight Hours</div>
                        <div className="comparison-bars">
                          <div className="comparison-bar my-bar" style={{ width: "75%" }}>
                            156h
                          </div>
                          <div className="comparison-bar friend-bar" style={{ width: "65%" }}>
                            127h
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-header">
          <h2>FlightTracker in numbers</h2>
          <p>Join a growing community of passionate travelers</p>
        </div>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item-large">
              <div className="stat-number-large">{stat.number}</div>
              <div className="stat-label-large">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What our users say</h2>
          <p>Find out why they love FlightTracker</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.comment}"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to discover your travel habits?</h2>
          <p>Join thousands of users already analyzing their trips with FlightTracker</p>
          <div className="cta-actions">
            <button className="cta-primary" onClick={() => onNavigate("signup")}>
              Create a free account
            </button>
            <button className="cta-secondary" onClick={() => onNavigate("demo")}>
Explore the demo            </button>
          </div>
        </div>
      </section>

    </div>

















  );
}

export default App;
