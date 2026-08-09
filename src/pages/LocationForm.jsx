import { useState, useEffect } from "react";
import { useParams } from "react-router";

import * as locationService from "../services/locations";

const HootForm = (props) => {
  const { locationId } = useParams();
  console.log(locationId);

  const initialState = {
    title: "",
    description: "",
    imageURL: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (locationId) {
      props.handleUpdateLocation(locationId, formData);
    } else {
      props.handleAddLocation(formData);
    }
  };

  useEffect(() => {
    const fetchHoot = async () => {
      const locationData = await locationService.show(locationID);
      setFormData(locationData);
    };
    if (locationId) fetchHoot();

    return () => setFormData(initialState);
  }, [locationId]);

  return (
    <main className="card">
      <h1>{locationId ? "Edit Location" : "New Location"}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title-input">Title</label>
        <input
          required
          type="text"
          name="title"
          id="title-input"
          value={formData.title}
          onChange={handleChange}
        />
        <label htmlFor="text-input">Description</label>
        <textarea
          required
          type="text"
          name="description"
          id="text-input"
          value={formData.description}
          onChange={handleChange}
        />
        <label htmlFor="category-input">Image URL</label>
        <input
          required
          type = "text"
          name="imageURL"
          id="category-input"
          value={formData.imageURL}
          onChange={handleChange}
        >
        </input>
        <button type="submit">SUBMIT</button>
      </form>
    </main>
  );
};

export default HootForm;
