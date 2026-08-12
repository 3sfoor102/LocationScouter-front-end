import { useEffect, useState } from "react";
import { index } from "../services/user";

const Dashboard = (props) => {
  return (
    <section>
      <header style={{ marginBottom: "32px", textAlign: "center" }}>
        <h1>Welcome {props.user.username}!</h1>
        <p style={{ color: "var(--color-text-light)" }}>
          Scout a Beautiful Location!
        </p>
      </header>
      <div className="hoot-list"></div>
    </section>
  );
};

export default Dashboard;
