import React from "react";
import "./Features.css";

function Features() {
  const features = [
    { title: "Explore Destinations", desc: "Find the best places to visit worldwide." },
    { title: "Plan Your Trip", desc: "Build custom itineraries and get travel tips." },
    { title: "Save Favorites", desc: "Bookmark your dream destinations easily." }
  ];

  return (
    <section className="features">
      {features.map((f, i) => (
        <div key={i} className="feature-card">
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </section>
  );
}

export default Features;
