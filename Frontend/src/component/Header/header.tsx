import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header id="header" className="fixed-top">
            <div className="header-inner">

                {/* Begin logo */}
                <div id="logo">
                    <Link to="/" className="logo-dark">
                        <img src="/assets/img/logo-dark.png" alt="logo" />
                    </Link>
                    <Link to="/" className="logo-light">
                        <img src="/assets/img/logo-light.png" alt="logo" />
                    </Link>
                </div>
                {/* End logo */}

                {/* Begin header tools */}
                <div className="header-tools">
                    <ul>
                        <li>
                            {/* Sign In button opens auth modal */}
                            <a
                                href="#signin"
                                className="btn btn-primary btn-sm text-uppercase"
                                data-toggle="modal"
                                data-target="#signinModal"
                                title="Sign in"
                            >
                                <i className="fas fa-user"></i>&nbsp; Sign In
                            </a>
                        </li>
                    </ul>
                </div>
                {/* End header tools */}

                {/* Begin menu (Bootstrap navbar) */}
                <nav className="navbar navbar-default">
                    <div className="navbar-inner">

                        {/* Toggle for better mobile display */}
                        <div className="navbar-header">
                            <button
                                type="button"
                                className="navbar-toggle collapsed"
                                data-toggle="collapse"
                                data-target="#navbar-collapse-1"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                        </div>

                        {/* Collect the nav links, forms, and other content for toggling */}
                        <div className="collapse navbar-collapse" id="navbar-collapse-1">
                            <ul className="nav navbar-nav navbar-right">

                                {/* Home dropdown */}
                                <li className="active"><Link to="/">Home</Link></li>

                                {/* Portfolio button */}
                                <li>
                                    <Link to="/portfolio">Portfolio</Link>
                                </li>

                                {/* Gallery dropdown */}
                                <li><Link to="/gallery">Gallery</Link></li>



                                {/*/!* Blog dropdown *!/*/}
                                {/*<li className="dropdown dropdown-hover">*/}
                                {/*    <a*/}
                                {/*        href="#0"*/}
                                {/*        className="dropdown-toggle"*/}
                                {/*        data-toggle="dropdown"*/}
                                {/*        aria-haspopup="true"*/}
                                {/*        aria-expanded="false"*/}
                                {/*    >*/}
                                {/*        Blog <span className="caret-2"><i className="fas fa-chevron-down"></i></span>*/}
                                {/*    </a>*/}
                                {/*    <ul className="dropdown-menu">*/}
                                {/*        <li><Link to="/blog-list-sidebar-right">Blog List</Link></li>*/}
                                {/*        <li><Link to="/blog-single-sidebar-right">Blog Single</Link></li>*/}
                                {/*    </ul>*/}
                                {/*</li>*/}

                                {/*/!* Pages dropdown *!/*/}
                                {/*<li className="dropdown dropdown-hover">*/}
                                {/*    <a*/}
                                {/*        href="#0"*/}
                                {/*        className="dropdown-toggle"*/}
                                {/*        data-toggle="dropdown"*/}
                                {/*        aria-haspopup="true"*/}
                                {/*        aria-expanded="false"*/}
                                {/*    >*/}
                                {/*        Pages <span className="caret-2"><i className="fas fa-chevron-down"></i></span>*/}
                                {/*    </a>*/}
                                {/*    <ul className="dropdown-menu">*/}
                                {/*        <li><Link to="/page-about-me">About Me</Link></li>*/}
                                {/*        <li><Link to="/page-about-us">About Us</Link></li>*/}
                                {/*        <li><Link to="/page-faq">FAQ</Link></li>*/}
                                {/*        <li><Link to="/page-login-register">Login/Register</Link></li>*/}
                                {/*        <li><Link to="/page-contact">Contact</Link></li>*/}
                                {/*        <li><Link to="/page-404">404 Error</Link></li>*/}
                                {/*    </ul>*/}
                                {/*</li>*/}

                                {/* Features dropdown */}
                                {/*<li className="dropdown dropdown-hover dropdown-menu-right">*/}
                                {/*    <a*/}
                                {/*        href="#0"*/}
                                {/*        className="dropdown-toggle"*/}
                                {/*        data-toggle="dropdown"*/}
                                {/*        aria-haspopup="true"*/}
                                {/*        aria-expanded="false"*/}
                                {/*    >*/}
                                {/*        Features <span className="caret-2"><i className="fas fa-chevron-down"></i></span>*/}
                                {/*    </a>*/}
                                {/*    /!*<ul className="dropdown-menu">*!/*/}
                                {/*    /!*    <li className="dropdown dropdown-submenu dropdown-hover">*!/*/}
                                {/*    /!*        <a*!/*/}
                                {/*    /!*            href="#0"*!/*/}
                                {/*    /!*            className="dropdown-toggle keep-inside-screen"*!/*/}
                                {/*    /!*            data-toggle="dropdown"*!/*/}
                                {/*    /!*            aria-haspopup="true"*!/*/}
                                {/*    /!*            aria-expanded="false"*!/*/}
                                {/*    /!*        >*!/*/}
                                {/*    /!*            Header <span className="caret-2"><i className="fas fa-chevron-right"></i></span>*!/*/}
                                {/*    /!*        </a>*!/*/}
                                {/*    /!*        <ul className="dropdown-menu">*!/*/}
                                {/*    /!*            <li><Link to="/features-header-static">Static</Link></li>*!/*/}
                                {/*    /!*            <li><Link to="/features-header-fixed">Fixed</Link></li>*!/*/}
                                {/*    /!*            <li><Link to="/features-header-show-hide-on-scroll">Fly Up/Down</Link></li>*!/*/}
                                {/*    /!*        </ul>*!/*/}
                                {/*    /!*    </li>*!/*/}

                                {/*    /!*    <li className="dropdown dropdown-submenu dropdown-hover">*!/*/}
                                {/*    /!*        <a*!/*/}
                                {/*    /!*            href="#0"*!/*/}
                                {/*    /!*            className="dropdown-toggle keep-inside-screen"*!/*/}
                                {/*    /!*            data-toggle="dropdown"*!/*/}
                                {/*    /!*            aria-haspopup="true"*!/*/}
                                {/*    /!*            aria-expanded="false"*!/*/}
                                {/*    /!*        >*!/*/}
                                {/*    /!*            Components <span className="caret-2"><i className="fas fa-chevron-right"></i></span>*!/*/}
                                {/*    /!*        </a>*!/*/}
                                {/*    /!*        <ul className="dropdown-menu">*!/*/}
                                {/*    /!*            <li><Link to="/components-accordion">Accordion</Link></li>*!/*/}
                                {/*    /!*            <li><Link to="/components-tabs">Tabs</Link></li>*!/*/}
                                {/*    /!*            <li><Link to="/components-buttons">Buttons</Link></li>*!/*/}
                                {/*    /!*        </ul>*!/*/}
                                {/*    /!*    </li>*!/*/}
                                {/*    /!*</ul>*!/*/}
                                {/*</li>*/}

                            </ul>
                        </div>

                    </div>
                </nav>
                {/* End menu */}

            </div>
        </header>
    );
};

export default Header;