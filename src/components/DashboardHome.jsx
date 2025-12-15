import React, { useState, useEffect } from 'react';
import './css/LandingPage.css';
import bannerImage from './css/venueeventbanner.jpg';

const DashboardHome = ({ onReadMoreClick }) => {
    const [popularVenue, setPopularVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPopularVenue();
    }, []);

    const fetchPopularVenue = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔄 Fetching popular venue...');
            const API_URL = 'https://hipolito-semimoderate-kandy.ngrok-free.dev/api/venues/popular';
            console.log('📡 Request URL:', API_URL);
            
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
            
            console.log('📥 Response status:', response.status);
            
            // First get response as text to check what we're receiving
            const responseText = await response.text();
            console.log('📥 Response first 200 chars:', responseText.substring(0, 200));
            
            // Check if response is HTML (error)
            if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
                console.error('❌ ERROR: Server returned HTML instead of JSON');
                
                // Check common HTML error pages
                if (responseText.includes('ngrok')) {
                    throw new Error('Ngrok tunnel error. Make sure ngrok is running with: ngrok http 5000');
                }
                if (responseText.includes('404')) {
                    throw new Error('API endpoint not found (404). Check if backend server is running.');
                }
                
                throw new Error('Server returned HTML error page. Check server logs.');
            }
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Parse JSON
            const data = JSON.parse(responseText);
            console.log('✅ Popular venue received:', data);
            
            setPopularVenue(data);
            
        } catch (err) {
            console.error('❌ Error fetching popular venue:', err);
            setError(err.message);
            
            // Set fallback venue for testing
            setPopularVenue({
                id: 1,
                name: 'Grand Ballroom',
                description: 'A luxurious venue for your special events. Perfect for weddings, corporate gatherings, and celebrations.',
                capacity: 500,
                price_per_hour: 2999,
                location: 'Downtown',
                image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
                booking_count: 15,
                address: '123 Main Street, City Center',
                contact_email: 'info@grandballroom.com',
                contact_phone: '+63 912 345 6789'
            });
        } finally {
            setLoading(false);
        }
    };

    // Rest of your component remains the same...
    const handleReadMore = () => {
        if (popularVenue && onReadMoreClick) {
            console.log('📍 Read More clicked for venue:', popularVenue.id, popularVenue.name);
            
            // Pass the complete venue data to parent
            onReadMoreClick({
                id: popularVenue.id,
                title: popularVenue.name,
                address: popularVenue.address,
                description: popularVenue.description,
                price: popularVenue.price_per_hour,
                capacity: popularVenue.capacity,
                contact_email: popularVenue.contact_email,
                contact_phone: popularVenue.contact_phone,
                image: popularVenue.image,
                location: popularVenue.location,
                booking_count: popularVenue.booking_count
            });
        }
    };

    return (
        <div className="tab-content active">
            {/* Hero / Banner */}
            <div className="home-hero">
                <img
                    src={bannerImage}
                    alt="INDUSTRIENT OF SECURITY - November 2023 Event Banner"
                    style={{
                        width: '100%',
                        maxHeight: '300px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                    }}
                />
            </div>

            {/* Popular Venues Section */}
            <div style={{ padding: '0 40px' }}>
                <div className="popular-label">
                    Popular venues
                </div>

                {loading ? (
                    <div className="loading">Loading popular venue...</div>
                ) : error ? (
                    <div className="error">
                        <p>Error: {error}</p>
                        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                            Using fallback venue data. Make sure:
                            <br />1. Backend server is running: <code>node server.js</code>
                            <br />2. Ngrok is running: <code>ngrok http 5000</code>
                        </p>
                    </div>
                ) : popularVenue ? (
                    <div className="popular-venue">
                        {/* Left Image */}
                        <img
                            src={popularVenue.image}
                            alt={popularVenue.name}
                            onError={(e) => {
                                console.error('❌ Image failed to load:', e.target.src);
                                e.target.src = 'https://via.placeholder.com/800x400?text=Venue+Image+Not+Available';
                            }}
                            onLoad={() => console.log('✅ Image loaded successfully')}
                        />

                        {/* Right Content */}
                        <div className="popular-content">
                            <h3>{popularVenue.name}</h3>
                            <p>{popularVenue.description}</p>
                            <p><strong>Capacity:</strong> {popularVenue.capacity} people</p>
                            <p><strong>Price:</strong> ₹{popularVenue.price_per_hour}/hour</p>
                            <p><strong>Location:</strong> {popularVenue.location}</p>
                            {popularVenue.booking_count > 0 && (
                                <p><strong>Bookings:</strong> {popularVenue.booking_count || 0} times</p>
                            )}
                            
                            <button 
                                className="read-more-btn"
                                onClick={handleReadMore}
                            >
                                Read More &gt;
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>No popular venue found</div>
                )}
            </div>
        </div>
    );
};

export default DashboardHome;
