import './style.css';
import { useEffect, useState } from 'react';

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Vérifier la présence d'un token dans le localStorage
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <div className="navbar">
            <div className='navbar-container'>
                <div className='navbar-logo'>
                    <a href="/home" className="logo-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin logo-icon">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="logo-text">FlightTracker</span>
                    </a>
                </div>
                <div className='desktop-nav'>
                    <a href="/home" className="nav-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin nav-icon" style={{ marginRight: '5px' }}>
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>My Map
                    </a>
                    <a href="/flightList" className="nav-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane" style={{ marginRight: '5px' }}>
                            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.7 3.3c-.5-.3-.9-.4-1.4-.4-.5 0-1 .2-1.4.4-.6.6-1 1.3-1 2 0 .3 0 .7.2 1l3.1 5.3-3.1 5.2c0 .3 0 .7.2 1 .3.6.7 1 1.3 1 .5 0 .9-.2 1.3-.4l8.3-4.7 3.2 2.6c.3.3.7.4 1.2.4.4 0 .8-.1 1.1-.4.5-.5.7-1.2.7-1.8z" />
                        </svg>
                        My Flights
                    </a>
                    <a href="/friend" className="nav-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users nav-icon" style={{ marginRight: '5px' }}>
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>My Friends
                    </a>
                    <a href="/stats" className="nav-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2 nav-icon" style={{ marginRight: '5px' }}>
                            <line x1="12" y1="20" x2="12" y2="10"></line>
                            <line x1="18" y1="20" x2="18" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="16"></line>
                        </svg>My Stats
                    </a>
                </div>
                <div className='desktop-auth'>
                    {!isAuthenticated ? (
                        <>
                            <button className="btn-outline" onClick={() => window.location.href = '/signin'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right nav-icon">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                                Sign in
                            </button>
                            <button className='button-black' onClick={() => window.location.href = '/signup'}>Sign up</button>
                        </>
                    ) : (
                        <button className='button-black' onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/';
                        }}>Disconnect</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
