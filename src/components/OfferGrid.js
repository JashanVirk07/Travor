import React from "react";
import "../styles/OfferGrid.css";

function OfferGrid() {
  const offers = [
    { img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", title: "Bali Adventure", price: "$120" },
    { img: "https://images.unsplash.com/photo-1493558103817-58b2924bce98", title: "Tokyo City Tour", price: "$95" },
    { img: "https://images.unsplash.com/photo-1534447677768-be436bb09401", title: "Paris Getaway", price: "$180" },
  ];

  return (
    <section className="offer-grid">
      <h2>Popular Experiences</h2>
      <div className="offers">
        {offers.map((o, i) => (
          <div className="offer-card" key={i}>
            <img src={o.img} alt={o.title} />
            <h3>{o.title}</h3>
            <p className="price">{o.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OfferGrid;
