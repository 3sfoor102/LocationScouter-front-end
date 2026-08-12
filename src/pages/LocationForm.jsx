import { useState, useEffect } from "react";
import LocationMapPicker from "../components/LocationMapPicker";
import * as locationService from "../services/locations";

const LocationForm = (props) => {
  const locationId = props.locationId;
  const initialState = {
    title: "",
    description: "",
    imageURL: "",
    lat: null,
    lng: null,
  };
  const [formData, setFormData] = useState(initialState);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleImageUpload = async (evt) => {
    const file = evt.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const { timestamp, signature } =
        await locationService.getUploadSignature();

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      uploadData.append("timestamp", timestamp);
      uploadData.append("signature", signature);
      uploadData.append("folder", "location_scouter");

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        },
      );

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) throw new Error(cloudinaryData.error.message);

      setFormData((prevData) => ({
        ...prevData,
        imageURL: cloudinaryData.secure_url,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
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

        <label htmlFor="image-upload">Location Image</label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
        />

        {isUploading && (
          <p className="hoot-text">
            Authenticating and uploading directly to Cloudinary...
          </p>
        )}

        {formData.imageURL && !isUploading && (
          <img
            src={formData.imageURL}
            alt="Location Preview"
            className="card-image-header"
          />
        )}

        <div className="map-picker-container">
          <label>Select Location on Map</label>
          <div className="map-picker-wrapper">
            <LocationMapPicker formData={formData} setFormData={setFormData} />
          </div>
        </div>

        <button type="submit" disabled={isUploading}>
          SUBMIT
        </button>
      </form>
    </main>
  );
};

export default LocationForm;
