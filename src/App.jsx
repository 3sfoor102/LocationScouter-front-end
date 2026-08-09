import Nav from "./components/Nav";
import SignUpForm from "./pages/SignUpForm";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import SignInForm from "./pages/SignInForm";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import HootList from "./pages/LocationList";
import * as locationService from "./services/locations";
import HootDetails from "./pages/LocationDetails";
import HootForm from "./pages/LocationForm";
import CommentForm from "./components/CommentForm";

const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1])).payload;
};

const App = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(getUserFromToken());
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchAllLocations = async () => {
      const locationsData = await locationService.index();
      setLocations(locationsData);
    };
    if (user) fetchAllLocations();
  }, [user]);

  const handleAddLocation = async (formData) => {
    const newLocation = await locationService.create(formData);
    setLocations([newLocation, ...locations]);
    navigate("/locations");
  };

  const handleDeleteLocation = async (locationId) => {
    const deletedLocation = await locationService.deleteHoot(locationId);
    setLocations(locations.filter((location) => location._id !== locationId));
    navigate("/locations");
  };

  const handleUpdateLocation = async (locationId, formData) => {
    const updatedLocation = await locationService.update(locationId, formData);
    const updatedLocationList = locations.map((location) => {
      return locationId === location._id ? updatedLocation : location;
    });
    setLocations(updatedLocationList);
    navigate(`/locations/${locationId}`);
  };

  return (
    <div>
      <Nav user={user} setUser={setUser} />
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={user ? <Dashboard user={user} /> : <Landing />}
          />
          {user ? (
            <>
              <Route path="/locations" element={<HootList locations={locations} />} />
              <Route
                path="/locations/:locationId"
                element={
                  <HootDetails
                    user={user}
                    handleDeleteLocation={handleDeleteLocation}
                  />
                }
              />
              <Route
                path="/locations/new"
                element={<HootForm handleAddLocation={handleAddLocation} />}
              />
              <Route
                path="/locations/:locationId/edit"
                element={<HootForm handleUpdateLocation={handleUpdateLocation} />}
              />
              <Route
                path="/locations/:locationId/reviews/:reviewId/edit"
                element={<CommentForm />}
              />
            </>
          ) : (
            <>
              <Route
                path="/sign-up"
                element={<SignUpForm setUser={setUser} />}
              />
              <Route
                path="/sign-in"
                element={<SignInForm setUser={setUser} />}
              />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};

export default App;
