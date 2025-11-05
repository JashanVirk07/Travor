import React from "react";
import "../styles/FeatureCards.css";

function FeatureCards() {
  const features = [
    { img: "https://img.icons8.com/color/96/000000/airport.png", title: "Airport Transfers", desc: "Seamless rides from airports worldwide." },
    { img: "https://img.icons8.com/color/96/000000/roller-coaster.png", title: "Theme Parks", desc: "Skip the lines with instant booking." },
    { img: "https://img.icons8.com/color/96/000000/train.png", title: "Rail Passes", desc: "Travel smoothly across destinations." },
  ];

  return (
    <section className="features">
      {features.map((f, i) => (
        <div className="feature-card" key={i}>
          <img src={f.img} alt={f.title} />
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </section>
  );
}

export default FeatureCards;
