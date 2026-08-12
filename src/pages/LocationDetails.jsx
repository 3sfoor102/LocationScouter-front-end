import { useParams, useNavigate } from "react-router";
import * as locationService from "../services/locations";
import { useState, useEffect } from "react";
import ReviewForm from "../components/ReviewForm";
import * as reviewService from "../services/reviews";
import { Map, Marker } from "pigeon-maps";
import axios from "axios";

const LocationDetails = (props) => {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const locationData = await locationService.show(locationId);
      setLocation(locationData);
    };
    fetchLocation();
  }, [locationId]);

  const handleAddReview = async (formData) => {
    const newReview = await reviewService.create(locationId, formData);
    setLocation({ ...location, reviews: [...location.reviews, newReview] });
  };

  const handleDeleteReview = async (reviewId) => {
    await reviewService.deleteReview(locationId, reviewId);
    const filteredReviews = location.reviews.filter((review) => {
      return review._id !== reviewId;
    });
    setLocation({ ...location, reviews: filteredReviews });
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (location?.lat && location?.lng) {
        try {
          const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
          const query = `${location.lat}, ${location.lng}`;
          const res = await axios.get(
            `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${query}`,
          );
          setWeather(res.data.current);
        } catch (error) {
          console.error("Error fetching weather:", error);
        }
      }
    };
    fetchWeather();
  }, [location]);

  if (!location)
    return (
      <main>
        <div className="loader"></div>
      </main>
    );

  return (
    <article className="card hoot-card">
      <header
        className="card-image-header"
        style={{ backgroundImage: `url(${location.imageURL})` }}
      ></header>
      
      <div className="hoot-header">
        <span className="hoot-category">
          {location.description.toUpperCase()}
        </span>
        <h2>{location.title}</h2>
        <p className="hoot-author" style={{ marginBottom: "16px" }}>
          Scouted by <strong>{location.author?.username || "Unknown user"}</strong> on{" "}
          {new Date(location.createdAt).toLocaleDateString()}
        </p>

        {/* --- Dashboard Widget Layout --- */}
        <div className="dashboard-widgets">
          
          {/* Top Wide Card: Score */}
          <div className="widget-card score-widget">
            <div className="score-info">
              <span className="widget-title">Author Scout Score</span>
              <div className="score-value-row">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
                </svg>
                <span className="score-number">{location.author?.points || 0}</span>
                <span className="score-status">Great</span>
              </div>
              <span className="widget-subtext">Keep exploring!</span>
            </div>
            
            <div className="progress-ring"></div>
          </div>

          {/* Bottom Grid: 3 Square Cards */}
          <div className="widget-grid-3">
            
            {/* Card 1: Reviews */}
            <div className="widget-card mini-widget">
              <span className="widget-title">Reviews</span>
              <span className="mini-value">{location.reviews?.length || 0}</span>
              <div className="mini-footer">
                <span className="widget-subtext">Total</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>

            {/* Card 2: Coordinates */}
            <div className="widget-card mini-widget">
              <span className="widget-title">Coordinates</span>
              <span className="mini-value" style={{ fontSize: "1.2rem" }}>
                {location.lat ? location.lat.toFixed(2) : '-'}
              </span>
              <div className="mini-footer">
                <span className="widget-subtext">Latitude</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </div>

            {/* Card 3: Weather */}
            {weather ? (
              <div className="widget-card mini-widget">
                <span className="widget-title">Weather</span>
                <div className="weather-val-row">
                  <span className="mini-value" style={{ marginBottom: 0 }}>{weather.temp_c}°C</span>
                  <img src={weather.condition.icon} alt="weather" className="mini-weather-icon" />
                </div>
                <div className="mini-footer">
                  <span className="widget-subtext" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "8px" }}>
                    {weather.condition.text}
                  </span>
                </div>
              </div>
            ) : (
              <div className="widget-card mini-widget">
                <span className="widget-title">Weather</span>
                <span className="mini-value">--</span>
                <span className="widget-subtext">Loading...</span>
              </div>
            )}
            
          </div>
        </div>
        {/* --- End Dashboard Widgets --- */}

        {location.author?._id === props.user?._id && (
          <div className="actions" style={{ marginBottom: "24px" }}>
            <button onClick={() => navigate(`/locations/${locationId}/edit`)} style={{ backgroundColor: "var(--color-surface-light)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
              Edit
            </button>
            <button onClick={() => props.handleDeleteLocation(locationId)} style={{ backgroundColor: "var(--color-error)", color: "#fff" }}>
              Delete
            </button>
          </div>
        )}
      </div>

      <p style={{ lineHeight: "1.6" }}>{location.description}</p>

      {location.lat && location.lng && (
        <div className="location-map-container" style={{ marginTop: "32px" }}>
          <h3 style={{ marginBottom: "12px" }}>Location Map</h3>
          <div className="location-map-wrapper">
            <Map
              height={300}
              defaultCenter={[location.lat, location.lng]}
              defaultZoom={14}
            >
              <Marker width={50} anchor={[location.lat, location.lng]} />
            </Map>
          </div>
          <div style={{ marginTop: "16px" }}>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "16px 24px",
                backgroundColor: "var(--color-primary)",
                color: "var(--color-surface)",
                textDecoration: "none",
                borderRadius: "var(--radius-pill)",
                fontWeight: "bold",
                width: "100%",
                transition: "background-color 0.2s ease"
              }}
            >
              Get Directions
            </a>
          </div>
        </div>
      )}

      <footer className="hoot-footer" style={{ borderTop: "none", marginTop: "40px", paddingTop: 0 }}>
        <section style={{ width: "100%" }}>
          <h3 style={{ marginBottom: "16px", borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>Reviews</h3>
          <ReviewForm handleAddReview={handleAddReview} />
          
          <div style={{ marginTop: "32px" }}>
            {!location.reviews.length && <p style={{ color: "var(--color-text-light)" }}>No reviews yet. Be the first to review this location!</p>}
            
            {location.reviews.map((review) => (
              <article key={review._id} className="review-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                  <p style={{ color: "var(--color-text)", fontWeight: "bold", margin: 0 }}>
                    {review.author?.username || "Unknown User"}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)", margin: 0 }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <p style={{ margin: "12px 0", lineHeight: "1.5" }}>{review.description}</p>
                
                {review.author?._id === props.user?._id && props.user && (
                  <div className="actions" style={{ marginTop: "16px", gap: "8px" }}>
                    <button
                      onClick={() => navigate(`/locations/${locationId}/reviews/${review._id}/edit`)}
                      style={{ padding: "8px 16px", fontSize: "0.85rem", backgroundColor: "var(--color-surface)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteReview(review._id)}
                      style={{ padding: "8px 16px", fontSize: "0.85rem", backgroundColor: "var(--color-surface)", color: "var(--color-error)", border: "1px solid var(--color-border)" }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </footer>
    </article>
  );
};

export default LocationDetails;