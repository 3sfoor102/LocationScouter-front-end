import { useParams, useNavigate } from "react-router";
import * as locationService from "../services/locations";
import { useState, useEffect } from "react";
import ReviewForm from "../components/ReviewForm";
import * as reviewService from "../services/reviews";

const LocationDetails = (props) => {
  const navigate = useNavigate();
  const { locationId } = useParams();

  const [location, setLocation] = useState(null);

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

  const handleDeleteLocation = async (reviewId) => {
    console.log("reviewId: ", reviewId);
    const deletedReview = reviewService.deleteReview(locationId, reviewId);
    const filteredReviews = location.reviews.filter((review) => {
      return review._id !== reviewId;
    });
    setLocation({ ...location, reviews: filteredReviews });
  };

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
        <h2>{location.title}</h2>
        <p className="hoot-text" align="center">
          <img src={location.imageURL} alt="a location background image" />
        </p>

        <p className="hoot-author">
          Posted by {location.author?.username || "Unknown user"} on{" "}
          <span>{new Date(location.createdAt).toLocaleDateString()}</span>
        </p>

        {location.author._id === props.user._id && (
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
                  <button onClick={() => handleDeleteLocation(location._id)}>
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
