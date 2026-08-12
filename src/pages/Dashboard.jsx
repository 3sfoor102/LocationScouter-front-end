import { useEffect, useState } from "react";
import { index } from "../services/user";

const Dashboard = (props) => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await index();
      setAllUsers(usersData);
    };
    fetchUsers();
  }, []);

  return (
    <section>
      <header style={{ marginBottom: "32px", textAlign: "center" }}>
        <h1>Welcome {props.user.username}!</h1>
        <p style={{ color: "var(--color-text-light)" }}>View All the Users</p>
      </header>
      <div className="hoot-list">
        {allUsers.map((user) => (
          <div className="card" key={user._id}>
            <header>
              <h2 style={{ color: "var(--color-primary)" }}>{user.username}</h2>
            </header>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;