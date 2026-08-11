const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/locations`;

const create = async (locationId, reviewFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${locationId}/reviews`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const deleteReview = async (locationId, reviewId) => {
  try {
    const res = await fetch(`${BASE_URL}/${locationId}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const update = async (locationId, reviewId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${locationId}/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export { create, deleteReview, update };
