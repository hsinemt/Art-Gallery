import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './pages/Home/Home.tsx';
import Portfolio from './pages/Portfolio/portfolio.tsx';
import PublicationsPage from './pages/Publications/Publications.tsx';
import ArtistProfile from './pages/Artist/ArtistProfile.tsx';
import PublicationDetail from './pages/Publications/PublicationDetail.tsx';
import './App.css';
import Preloader from "./component/Preloader/preloader.tsx";
import Header from "./component/Header/header.tsx";
import Footer from "./component/Footer/footer.tsx";
import SignInModal from "./component/Auth/SignInModal";
import RegisterModal from "./component/Auth/RegisterModal";

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate preloader
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading && <Preloader />}

            <Router>
                <div id="body">
                    <Header />

                    <div id="body-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/portfolio" element={<Portfolio />} />
                            <Route path="/publications" element={<PublicationsPage />} />
                            <Route path="/publications/:id" element={<PublicationDetail />} />
                            <Route path="/artist/:id" element={<ArtistProfile />} />
                            {/* Add more routes here as needed */}
                        </Routes>
                    </div>

                    <Footer />

                    {/* Scroll to top button */}
                    <a href="#body" className="scrolltotop sm-scroll">
                        <i className="fas fa-chevron-up"></i>
                    </a>

                    {/* Auth Modals */}
                    <SignInModal />
                    <RegisterModal />
                </div>
            </Router>
        </>
    );
}

export default App;