import './footer.css';

const Footer = () => {
    return (
        <footer id="footer" className="app-footer">
            <div className="footer-inner">
                <div className="copyright">
                    &copy; Agatha / All rights reserved
                </div>

                <div className="social-icons">
                    <ul>
                        <li>
                            <a
                                target="_blank"
                                href="https://www.facebook.com"
                                rel="noopener noreferrer"
                                title="Follow us on Facebook"
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://twitter.com/"
                                rel="noopener noreferrer"
                                title="Follow us on Twitter"
                            >
                                <i className="fab fa-twitter"></i>
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://www.pinterest.com"
                                rel="noopener noreferrer"
                                title="Follow us on Pinterest"
                            >
                                <i className="fab fa-pinterest-p"></i>
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://www.instagram.com"
                                rel="noopener noreferrer"
                                title="Follow us on Instagram"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="mailto:your@email.com"
                                title="Contact Us"
                            >
                                <i className="fas fa-envelope"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;