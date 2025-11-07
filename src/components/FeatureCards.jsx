import React from "react";
import "../styles/FeatureCards.css";

function FeatureCards() {
  const features = [
    { img: "https://img.icons8.com/color/96/000000/airport.png", title: "Authentic journeys for travellers", desc: "Go beyond the tourist traps. Find unique, hand-crafted itineraries from local experts." },
    { img: "https://img.icons8.com/color/96/000000/roller-coaster.png", title: "Monetize Local Knowledge", desc: "Set your own rates and schedule. Connect directly with a global audience of eager travellers." },
    { img: "https://img.icons8.com/color/96/000000/train.png", title: "**Trust & Safety**", desc: "Secure payments and verified profiles ensure a reliable and enjoyable experience for everyone." },
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
