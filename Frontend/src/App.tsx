import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './pages/Home/Home.tsx';
import Portfolio from './pages/Portfolio/portfolio.tsx';
import Rapports from './pages/Rapports/index.tsx';
import Reclamations from './pages/Reclamations/index.tsx';
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
                            <Route path="/rapports" element={<Rapports />} />
                            <Route path="/reclamations" element={<Reclamations />} />
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