import React from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import FeatureCards from "../components/FeatureCards";
import OfferGrid from "../components/OfferGrid";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <HeroBanner />
      <FeatureCards />
      <OfferGrid />
      <CTASection />
      <Footer />
    </>
  );
}

export default Home;
