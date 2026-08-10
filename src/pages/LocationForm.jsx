import { useState, useEffect } from "react";
import { useParams } from "react-router";
import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

import * as locationService from "../services/locations";
import js from "@eslint/js";

const LocationForm = (props) => {
  const { locationId } = useParams();
  console.log(locationId);

  const initialState = {
    title: "",
    description: "",
    imageURL: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [showReceipt, setShowReceipt] = useState(false);
  const printAreaRef = useRef();

  const PDFgenerate = (e) => {
        e.preventDefault(); 

    const element = printAreaRef.current;
    const options = {
      margin: 0.5,
      filename: "A",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save()
  };

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setShowReceipt(true)
    if (locationId) {
      props.handleUpdateLocation(locationId, formData);
    } else {
      props.handleAddLocation(formData);
    }
  };

  useEffect(() => {
    const fetchHoot = async () => {
      const locationData = await locationService.show(locationId);
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
          type="text"
          name="imageURL"
          id="category-input"
          value={formData.imageURL}
          onChange={handleChange}
        ></input>
        <button type="button" onClick={PDFgenerate}>Download as PDF</button>
        <button type="submit">SUBMIT</button>
        <div ref={printAreaRef} className="">
          <h1>Submission Receipt</h1>
          <p><strong>Date: </strong>{new Date().toLocaleDateString()}</p>
          <p><strong>Title: </strong> {formData.title}</p>
          <p><strong>Description: </strong> {formData.description}</p>
          {/* <p><stong>Title: </stong> {formData.imageURL}</p> */}

        </div>
        
      </form>
    </main>
  );
};

export default LocationForm;
