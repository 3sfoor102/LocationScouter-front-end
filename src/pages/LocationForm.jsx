import { useState, useEffect } from "react";
import { useParams } from "react-router";
import LocationMapPicker from "../components/LocationMapPicker";
import * as locationService from "../services/locations";

const LocationForm = (props) => {
  const { locationId } = useParams();
  const initialState = {
    title: "",
    description: "",
    imageURL: "",
    lat: null,
    lng: null,
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
    const fetchLocation = async () => {
      const locationData = await locationService.show(locationId);
      setFormData(locationData);
    };
    if (locationId) fetchLocation();
    return () => setFormData(initialState);
  }, [locationId]);

  return (
    <main className="card">
      <h1>{locationId ? "Edit Location" : "New Location"}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title-input">Title</label>
        <input required type="text" name="title" id="title-input" value={formData.title} onChange={handleChange} />
        <label htmlFor="text-input">Description</label>
        <textarea required type="text" name="description" id="text-input" value={formData.description} onChange={handleChange} />
        <label htmlFor="category-input">Image URL</label>
        <input required type="text" name="imageURL" id="category-input" value={formData.imageURL} onChange={handleChange}></input>
        <div className="map-picker-container">
          <label>Select Location on Map</label>
          <div className="map-picker-wrapper">
            <LocationMapPicker formData={formData} setFormData={setFormData} />
          </div>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </main>
  );
};

export default LocationForm;