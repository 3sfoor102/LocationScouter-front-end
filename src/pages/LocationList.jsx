import { Link } from "react-router"
import Icon from "../components/Icon"

const LocationList = (props) => {
  return (
    <main className="hoot-list">
      {props.locations.map((location) => (
        <Link key={location._id} to={`/locations/${location._id}`}>
            <article className="card">
                <header>
                    <span className="hoot-category">{location.description}</span>
                    <h2 key={location._id}>{location.title}</h2> 
                    <p className="hoot-author">Posted by {location.author?.username || 'Unknown user'}</p>
                </header>
                <Icon category={location.description} />
                <p className="hoot-text">{location.description}</p>
                <footer className="hoot-footer">
                <span>
                    {new Date(location.createdAt).toLocaleDateString()}
                </span>
                <span>
                    {location.reviews?.length || 0} reviews
                </span>
                </footer>
            </article>
        </Link>
      ))}
    </main>
  )
}

export default LocationList