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

  // FIXED: Clears form when moving from "Edit" to "New Location"
  useEffect(() => {
    const fetchLocation = async () => {
      const locationData = await locationService.show(locationId);
      if (locationData) setFormData(locationData);
    };

    if (locationId) {
      fetchLocation();
    } else {
      setFormData(initialState); // Clear form if we are creating a NEW location
    }
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

        <label>Location Image</label>
        <div className="image-upload-wrapper">
          <input
            type="file"
            id="image-upload-input"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />

          {!formData.imageURL && !isUploading && (
            <label
              htmlFor="image-upload-input"
              className="image-dropzone-label"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginBottom: "8px", opacity: 0.7 }}
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span>Click to upload scout photo</span>
              <span className="image-dropzone-sub">
                PNG, JPG, WEBP up to 10MB
              </span>
            </label>
          )}

          {isUploading && (
            <div className="image-uploading-state">
              <p className="hoot-text" style={{ margin: 0 }}>
                Uploading to Cloudinary securely...
              </p>
            </div>
          )}

          {formData.imageURL && !isUploading && (
            <div className="image-preview-container">
              <img
                src={formData.imageURL}
                alt="Location Preview"
                className="card-image-header"
              />
              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <label
                  htmlFor="image-upload-input"
                  className="btn-secondary-action"
                  style={{
                    cursor: "pointer",
                    padding: "8px 16px",
                    fontSize: "0.85rem",
                    display: "inline-block",
                  }}
                >
                  Change Image
                </label>
              </div>
            </div>
          )}
        </div>

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
