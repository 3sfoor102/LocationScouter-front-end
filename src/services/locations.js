const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/locations`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) return []; 
    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

const show = async (locationId) => {
  try {
    const res = await fetch(`${BASE_URL}/${locationId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) throw new Error("Failed to fetch location");
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const create = async (locationFormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(locationFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const deleteLocation = async (locationId) => {
  try {
    const res = await fetch(`${BASE_URL}/${locationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

async function update(locationId, locationFormData) {
  try {
    const res = await fetch(`${BASE_URL}/${locationId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(locationFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export const getUploadSignature = async () => {
  try {
    const res = await fetch(`http://localhost:3000/upload/signature`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to get signature");

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { index, show, create, deleteLocation, update };
