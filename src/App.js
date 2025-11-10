import React from 'react';
import { useApp } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import MyProfilePage from './pages/MyProfilePage.jsx';
import DestinationsPage from './pages/DestinationsPage.jsx';
import GuidesPage from './pages/GuidesPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

const App = () => {
  const { currentPage, loading } = useApp();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'myprofile':
        return <MyProfilePage />;
      case 'destinations':
        return <DestinationsPage />;
      case 'guides':
        return <GuidesPage />;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div style={styles.app}>
      <Navbar />
      <main style={styles.main}>{renderPage()}</main>
      <Footer />
    </div>
  );
};

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
  },
};

export default App;