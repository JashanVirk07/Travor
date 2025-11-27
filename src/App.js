// src/App.js
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import MyProfilePage from './pages/MyProfilePage.jsx';
import DestinationsPage from './pages/DestinationsPage.jsx';
import GuidesPage from './pages/GuidesPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import GuideDashboardPage from './pages/GuideDashboardPage.jsx';
import TourDetailsPage from './pages/TourDetailsPage.jsx';
import GuideProfilePage from './pages/GuideProfilePage.jsx';
import BookingConfirmationPage from './pages/BookingConfirmationPage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import ContactPage from './pages/ContactPage.jsx';

function AppContent() {
  const { currentPage } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'myprofile':
        return <MyProfilePage />;
      case 'destinations':
        return <DestinationsPage />;
      case 'tour-details':
        return <TourDetailsPage />;
      case 'guides':
        return <GuidesPage />;
      case 'guide-profile':
        return <GuideProfilePage />;
      case 'guide-dashboard':
        return <GuideDashboardPage />;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'booking-confirmation':
        return <BookingConfirmationPage />;
      case 'messages':
        return <MessagesPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
         case 'contact':
        return <ContactPage />;

      default:
        return <HomePage />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        {renderPage()}
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;