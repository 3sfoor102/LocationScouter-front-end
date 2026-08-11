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
    console.log("reviewId: ", reviewId);
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
      <header className="hoot-header">
        <span className="hoot-category">
          {location.description.toUpperCase()}
        </span>
        <span className="hoot-text">
          {location.author.points? location.author.points:'Add a location to get 10 points!' }
        </span>
        <h2>{location.title}</h2>
        <p className="hoot-text" align="center">
          <img src={location.imageURL} alt="a location background image" />
        </p>

        <p className="hoot-author">
          Posted by {location.author?.username || "Unknown user"} on{" "}
          <span>{new Date(location.createdAt).toLocaleDateString()}</span>
        </p>

        {location.author?._id === props.user?._id && (
          <div className="actions">
            <button onClick={() => navigate(`/locations/${locationId}/edit`)}>
              Edit
            </button>
            <button onClick={() => props.handleDeleteLocation(locationId)}>
              Delete
            </button>
          </div>
        )}
      </header>

      <p className="hoot-text">{location.description}</p>
      {weather && (
        <div
          className="weather-container"
          style={{
            margin: "20px 0",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Current Scout Conditions</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              <img src={weather.condition.icon} alt="weather icon" />
              <span>{weather.temp_c}°C</span>
            </div>
            <div>
              <p style={{ margin: "5px 0" }}>
                <strong>Cloud Cover:</strong> {weather.cloud}%
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Visibility:</strong> {weather.vis_km} km
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Condition:</strong> {weather.condition.text}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Wind KPH:</strong> {weather.wind_kph}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Humidity:</strong> {weather.humidity}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Feels Like:</strong> {weather.feelslike_c}
              </p>
            </div>
          </div>
        </div>
      )}

      {location.lat && location.lng && (
        <div className="location-map-container">
          <h3>Location Map</h3>
          <div className="location-map-wrapper">
            <Map
              height={300}
              defaultCenter={[location.lat, location.lng]}
              defaultZoom={14}
            >
              <Marker width={50} anchor={[location.lat, location.lng]} />
            </Map>
          </div>
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                backgroundColor: "#4285F4",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px",
                fontWeight: "bold"
              }}
            >
              🚗 Get Directions
            </a>
          </div>
        </div>

        
      )}

      <footer className="hoot-footer">
        <section>
          <h2>Reviews</h2>
          <ReviewForm handleAddReview={handleAddReview} />
          {!location.reviews.length && <p>There are no reviews.</p>}
          {location.reviews.map((review) => (
            <article key={review._id}>
              <header></header>
              <p>{`${review.author.username} posted on ${new Date(review.createdAt).toLocaleDateString()}`}</p>
              <p>{review.description}</p>

              {review.author._id === props.user._id && (
                <div className="actions">
                  <button
                    onClick={() =>
                      navigate(
                        `/locations/${locationId}/reviews/${review._id}/edit`,
                      )
                    }
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDeleteReview(review._id)}>
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      </footer>
    </article>
  );
};

export default LocationDetails;
