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
        <h2>{location.title}</h2>
        <p className="hoot-author location-author-spacing">
          Scouted by{" "}
          <strong>{location.author?.username || "Unknown user"}</strong> on{" "}
          {new Date(location.createdAt).toLocaleDateString()}
        </p>

        <div className="dashboard-widgets">
          <div className="widget-card score-widget">
            <div className="score-info">
              <span className="widget-title">Author Scout Score</span>
              <div className="score-value-row">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
                <span className="score-number">
                  {location.author?.points || 0}
                </span>
                {location.author?.points < 100 ? (
                  <span className="score-status">Bronze Scouter</span>
                ) : (
                  "not yet"
                )}
              </div>
              <span className="widget-subtext">Keep exploring!</span>
            </div>

            <div className="progress-ring"></div>
          </div>

          <div className="widget-grid-3">
            <div className="widget-card mini-widget">
              <span className="widget-title">Reviews</span>
              <span className="mini-value">
                {location.reviews?.length || 0}
              </span>
              <div className="mini-footer">
                <span className="widget-subtext">Total</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-light)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>

            <div className="widget-card mini-widget">
              <span className="widget-title">Humidity</span>
              <span className="mini-value coordinate-font-adjust">
                {weather?.humidity}%{" "}
              </span>
              <div className="mini-footer">
                <span className="widget-subtext coordinate-subtext-adjust">
                  In Bahrain? Always Hot ::(
                </span>
              </div>
            </div>

            {weather ? (
              <div className="widget-card mini-widget">
                <span className="widget-title">Weather</span>
                <div className="weather-val-row">
                  <span className="mini-value weather-value-reset">
                    {weather.temp_c}°C
                  </span>
                  <img
                    src={weather.condition.icon}
                    alt="weather"
                    className="mini-weather-icon"
                  />
                </div>
                <div className="mini-footer">
                  <span className="widget-subtext weather-subtext-ellipsis">
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

        {location.author?._id === props.user?._id && (
          <div className="actions location-actions-spacing">
            <button
              onClick={() => navigate(`/locations/${locationId}/edit`)}
              className="btn-edit-theme"
            >
              Edit
            </button>

            <button
              type="button"
              className="submit btn-delete-action"
              popoverTarget="delete-popover"
            >
              Delete
            </button>

            <div
              id="delete-popover"
              popover="auto"
              className="delete-popover-box"
            >
              <h3 className="popover-title-spacing">Confirm Delete</h3>
              <p>
                Are you sure you want to delete this location? This cannot be
                undone.
              </p>

              <div className="popover-actions-flex">
                <button
                  type="button"
                  popoverTargetAction="delete-popover"
                  popoverTargetAction="hide"
                  className="btn-popover-cancel"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => props.handleDeleteLocation(locationId)}
                  className="btn-popover-confirm"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="description-text-style">{location.description}</p>

      {location.lat && location.lng && (
        <div className="location-map-container location-map-margin">
          <h3 className="map-title-spacing">Location Map</h3>
          <div className="location-map-wrapper">
            <Map
              height={300}
              defaultCenter={[location.lat, location.lng]}
              defaultZoom={14}
            >
              <Marker width={50} anchor={[location.lat, location.lng]} />
            </Map>
          </div>
          <div className="directions-btn-wrapper">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="directions-anchor-btn"
            >
              Get Directions
            </a>
          </div>
        </div>
      )}

      <footer className="reviews-section">
        <div className="reviews-container">
          <h3 className="section-title">Reviews</h3>

          <div className="review-form-wrapper">
            <ReviewForm handleAddReview={handleAddReview} />
          </div>

          <div className="reviews-list">
            {!location.reviews.length && (
              <div className="empty-state">
                <p>No reviews yet. Be the first to review this location!</p>
              </div>
            )}

            {location.reviews.map((review) => (
              <article key={review._id} className="modern-review-card">
                <header className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {(review.author?.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="reviewer-name">
                      {review.author?.username || "Unknown User"}
                    </span>
                  </div>
                  <time className="review-date">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </header>

                <div className="review-body">
                  <p>{review.description}</p>
                </div>

                {review.author?._id === props.user?._id && props.user && (
                  <footer className="review-actions">
            
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="btn-text delete-btn"
                    >
                      Delete
                    </button>
                  </footer>
                )}
              </article>
            ))}
          </div>
        </div>
      </footer>
    </article>
  );
};

export default LocationDetails;