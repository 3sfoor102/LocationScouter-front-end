import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import * as locationService from "../services/locations";
import * as reviewsService from "../services/reviews";

const CommentForm = (props) => {
  const { locationId, reviewId } = useParams();
  const navigate = useNavigate();
  const initialState = {
    description: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (locationId && reviewId) {
      reviewsService.update(locationId, reviewId, formData);
      navigate(`/locations/${locationId}`);
    } else {
      props.handleAddReview(formData);
    }
    setFormData(initialState);
  };

  useEffect(() => {
    const fetchReview = async () => {
      const locationData = await locationService.show(locationId);
      const foundReview = locationData.reviews.find((review) => {
        return review._id === reviewId;
      });
      if (foundReview) {
        setFormData({ description: foundReview.description });
      }
    };
    if (locationId && reviewId) fetchReview();
  }, [locationId, reviewId]);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text-input">Your review:</label>
      <textarea
        required
        name="description"
        id="text-input"
        value={formData.description}
        onChange={handleChange}
      />
      <button type="submit">SUBMIT REVIEW</button>
    </form>
  );
};

export default CommentForm;