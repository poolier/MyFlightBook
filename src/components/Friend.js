import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";

function Friend() {
    const [showPopup, setShowPopup] = useState(false);
    const [friendEmail, setFriendEmail] = useState("");
    const [friendlistRequest, setFriendlistRequest] = useState([]);
    const [friendlist, setFriendlist] = useState([]);

    useEffect(() => {
        const fetchFriendListRequest = async () => {
            const userToken = localStorage.getItem('token');
            if (!userToken) return;
            try {
                const response = await axios.get(`https://lolprostat.com:8088/Flight/friendRequestList?token=${userToken}`);
                setFriendlistRequest(response.data.flights);
                console.log("Friend requests list:", response.data.flights);
            } catch (error) {
                console.error("Error fetching airports:", error);
            }
        };

        const fetchFriendList = async () => {
            const userToken = localStorage.getItem('token');
            if (!userToken) return;
            try {
                const response = await axios.get(`https://lolprostat.com:8088/Flight/friendList?token=${userToken}`);
                setFriendlist(response.data.flights);
                console.log("Friends list:", response.data.flights);
            } catch (error) {
                console.error("Error fetching airports:", error);
            }
        };

        fetchFriendListRequest();
        fetchFriendList();
    }, []);

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://lolprostat.com:8088/Flight/friendRequest', {
                token: token,
                emailReceveur: friendEmail
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Friend request sent successfully', response.data);
            handleClosePopup();
        } catch (error) {
            console.error('Error sending friend request', error);
        }
    };

    const handleAccept = async (emailDemandeur) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://lolprostat.com:8088/Flight/friendRequestAccept', {
                token: token,
                emailReceveur: emailDemandeur
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Friend request accepted successfully', response.data);
            // Reload the page after accepting the request
            window.location.reload();
        } catch (error) {
            console.error('Error accepting friend request', error);
        }
    };

    return (
        <div className="app-container">
            <Navbar />
            <div className="friend-container">
                <div className="friends-header">
                    <div className="header-content"><h1>My Friends</h1><p>5 friends • 3 online</p></div>
                    <button className="add-friend-btn" onClick={handleOpenPopup}><span className="btn-icon2">👥</span>Add a friend</button>
                </div>

                <div className="friend-requests">
                    <h3>Friend Requests ({friendlistRequest.length})</h3>
                    <div className="requests-list">
                        {friendlistRequest.map((user) => (
                            <div className="request-card" key={user.email_demandeur}>
                                <div className="request-info">
                                    <span className="request-avatar">👨‍🎓</span>
                                    <div className="request-details">
                                        <span className="request-name">{user.email_demandeur}</span>
                                        <span className="request-mutual">3 mutual friends</span>
                                    </div>
                                </div>
                                <div className="request-actions">
                                    <button className="accept-btn" onClick={() => handleAccept(user.email_demandeur)}>Accept</button>
                                    <button className="decline-btn">Decline</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="friends-controls">
                    <div className="search-container">
                        <input placeholder="Search for a friend..." className="search-input2" type="text" value="" />
                        <span className="search-icon22">🔍</span>
                    </div>
                    <div className="sort-container">
                        <label htmlFor="sort">Sort by:</label>
                        <select id="sort" className="sort-select">
                            <option value="name">Name</option>
                            <option value="flights">Number of flights</option>
                            <option value="hours">Flight hours</option>
                            <option value="distance">Distance traveled</option>
                            <option value="activity">Last activity</option>
                        </select>
                    </div>
                </div>

                <div className="friends-grid">
                    {friendlist.map((user) => (
                    <div className="friend-card" key={user.email}>
                        <div className="friend-header">
                            <div className="friend-avatar-container"><span className="friend-avatar">👩‍🔬</span></div>
                            <div className="friend-info"><h3 className="friend-name">{user["email_two"]}</h3><p className="friend-email">{user.email}</p><span className="friend-status">Online</span></div>
                            <div className="friend-actions"><button className="action-btn message-btn" title="Send a message">💬</button><button className="action-btn remove-btn" title="Remove">🗑️</button></div>
                        </div>
                        <div className="friend-stats">
                            <div className="stat-item"><span className="stat-icon22">✈️</span><div className="stat-content"><span className="stat-value24">41</span><span className="stat-label24">Flights</span></div></div>
                            <div className="stat-item"><span className="stat-icon22">⏱️</span><div className="stat-content"><span className="stat-value24">156h 42m</span><span className="stat-label24">Hours</span></div></div>
                            <div className="stat-item"><span className="stat-icon22">🌍</span><div className="stat-content"><span className="stat-value24">98,760 km</span><span className="stat-label24">Distance</span></div></div>
                        </div>
                        <div className="friend-details">
                            <div className="detail-row"><span className="detail-label23">Favorite destination:</span><span className="detail-value23">London</span></div>
                            <div className="detail-row"><span className="detail-label23">Common destinations:</span><span className="detail-value23">9</span></div>
                            <div className="detail-row"><span className="detail-label23">Last activity:</span><span className="detail-value23">01/21/2024</span></div>
                        </div>
                        <div className="friend-footer">
                            <button className="compare-btn">Compare our statistics</button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            {showPopup && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add a friend</h2>
                            <button className="close-btn" onClick={handleClosePopup}>✕</button>
                        </div>
                        <form className="add-friend-form" onSubmit={handleSubmit}>
                            <div className="form-group2">
                                <label htmlFor="friendEmail">Your friend's email address</label>
                                <input
                                    id="friendEmail"
                                    placeholder="example@email.com"
                                    required
                                    type="email"
                                    value={friendEmail}
                                    onChange={(e) => setFriendEmail(e.target.value)}
                                />
                                <small>We will send a friend request to this address.</small>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-btn2" onClick={handleClosePopup}>Cancel</button>
                                <button type="submit" className="submit-btn2">Send request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Friend;
