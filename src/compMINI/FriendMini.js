import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function FriendMini() {
    const [showPopup, setShowPopup] = useState(false);
    const [friendEmail, setFriendEmail] = useState("");
    const [friendlistRequest, setFriendlistRequest] = useState([]);
    const [friendlist, setFriendlist] = useState([]);

    useEffect(() => {
        const fetchFriendListRequest = async () => {
            
            try {
                const response = await axios.get(`https://lolprostat.com:8088/Flight/friendRequestListDemo?email=test@test.test`);
                setFriendlistRequest(response.data.flights);
                console.log("Liste de demande d'amis:", response.data.flights);
            } catch (error) {
                console.error("Error fetching airports:", error);
            }
        };

        const fetchFriendList = async () => {
            const email = localStorage.getItem('demo');
            if (!email) return;
            try {
                const response = await axios.get(`https://lolprostat.com:8088/Flight/friendListDemo?email=test@test.test`);
                setFriendlist(response.data.flights);
                console.log("Liste d'amis:", response.data.flights);
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
            console.log('Demande d\'ami envoyée avec succès', response.data);
            handleClosePopup();
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la demande d\'ami', error);
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
            console.log('Demande d\'ami acceptée avec succès', response.data);
            // Recharger la page après avoir accepté la demande
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de l\'acceptation de la demande d\'ami', error);
        }
    };

    return (
        <div className="app-container" style={{ overflow: "auto", width: "100%", paddingTop: "140px", backgroundColor: "#f8f9fa" }}>
            <div className="friend-container">
                <div className="friends-header">
                    <div className="header-content"><h1>Mes Amis</h1><p>5 amis • 3 en ligne</p></div>
                </div>

                <div className="friend-requests">
                    <h3>Demandes d'amis ({friendlistRequest.length})</h3>
                    <div className="requests-list">
                        {friendlistRequest.map((user) => (
                            <div className="request-card" key={user.email_demandeur}>
                                <div className="request-info">
                                    <span className="request-avatar">👨‍🎓</span>
                                    <div className="request-details">
                                        <span className="request-name">{user.email_demandeur}</span>
                                        <span className="request-mutual">3 amis en commun</span>
                                    </div>
                                </div>
                                <div className="request-actions">
                                    <button className="accept-btn" onClick={() => handleAccept(user.email_demandeur)}>Accepter</button>
                                    <button className="decline-btn">Refuser</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="friends-controls">
                    <div className="search-container">
                        <input placeholder="Rechercher un ami..." className="search-input2" type="text" value="" />
                        <span className="search-icon22">🔍</span>
                    </div>
                    <div className="sort-container">
                        <label htmlFor="sort">Trier par:</label>
                        <select id="sort" className="sort-select">
                            <option value="name">Nom</option>
                            <option value="flights">Nombre de vols</option>
                            <option value="hours">Heures de vol</option>
                            <option value="distance">Distance parcourue</option>
                            <option value="activity">Dernière activité</option>
                        </select>
                    </div>
                </div>

                <div className="friends-grid">
                    {friendlist.map((user) => (
                        <div className="friend-card" key={user.email}>
                            <div className="friend-header">
                                <div className="friend-avatar-container"><span className="friend-avatar">👩‍🔬</span></div>
                                <div className="friend-info"><h3 className="friend-name">{user["email_two"]}</h3><p className="friend-email">{user.email}</p><span className="friend-status">En ligne</span></div>
                                <div className="friend-actions"><button className="action-btn message-btn" title="Envoyer un message">💬</button><button className="action-btn remove-btn" title="Supprimer">🗑️</button></div>
                            </div>
                            <div className="friend-stats">
                                <div className="stat-item"><span className="stat-icon22">✈️</span><div className="stat-content"><span className="stat-value24">41</span><span className="stat-label24">Vols</span></div></div>
                                <div className="stat-item"><span className="stat-icon22">⏱️</span><div className="stat-content"><span className="stat-value24">156h 42m</span><span className="stat-label24">Heures</span></div></div>
                                <div className="stat-item"><span className="stat-icon22">🌍</span><div className="stat-content"><span className="stat-value24">98 760 km</span><span className="stat-label24">Distance</span></div></div>
                            </div>
                            <div className="friend-details">
                                <div className="detail-row"><span className="detail-label23">Destination favorite:</span><span className="detail-value23">London</span></div>
                                <div className="detail-row"><span className="detail-label23">Destinations communes:</span><span className="detail-value23">9</span></div>
                                <div className="detail-row"><span className="detail-label23">Dernière activité:</span><span className="detail-value23">21/01/2024</span></div>
                            </div>
                            <div className="friend-footer">
                                <button className="compare-btn">Comparer nos statistiques</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showPopup && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Ajouter un ami</h2>
                            <button className="close-btn" onClick={handleClosePopup}>✕</button>
                        </div>
                        <form className="add-friend-form" onSubmit={handleSubmit}>
                            <div className="form-group2">
                                <label htmlFor="friendEmail">Adresse email de votre ami</label>
                                <input
                                    id="friendEmail"
                                    placeholder="exemple@email.com"
                                    required
                                    type="email"
                                    value={friendEmail}
                                    onChange={(e) => setFriendEmail(e.target.value)}
                                />
                                <small>Nous enverrons une demande d'ami à cette adresse.</small>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-btn2" onClick={handleClosePopup}>Annuler</button>
                                <button type="submit" className="submit-btn2">Envoyer la demande</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FriendMini;
