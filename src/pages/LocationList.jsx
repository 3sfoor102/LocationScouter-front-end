import { Link } from "react-router";

const LocationList = (props) => {
  return (
    <main className="hoot-list">
      {props.locations.map((location) => (
        <Link key={location._id} to={`/locations/${location._id}`}>
          <article className="card">
            <header
              className="card-image-header"
              style={{ backgroundImage: `url(${location.imageURL})` }}
            ></header>
            <span className="hoot-category">{location.title}</span>
            <h2>{location.description}</h2>
            <p className="hoot-author">
              Scouted by {location.author?.username || "Unknown user"}
            </p>
            <footer className="hoot-footer">
              <span>{new Date(location.createdAt).toLocaleDateString()}</span>
              <span>{location.reviews?.length || 0} reviews</span>
            </footer>
          </article>
        </Link>
      ))}
    </main>
  );
};

export default LocationList;