import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();

    const openRegister = () => {
        // @ts-ignore
        if (window && (window as any).$) {
            const $ = (window as any).$;
            if ($) {
                $('#registerModal').modal('show');
            }
        }
    };

    const openSignIn = () => {
        // @ts-ignore
        if (window && (window as any).$) {
            const $ = (window as any).$;
            if ($) {
                $('#signinModal').modal('show');
            }
        }
    };

    const onLogout = async () => {
        await logout();
    };

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
                        {!user ? (
                            <>
                                <li>
                                    <button
                                        onClick={openSignIn}
                                        className="btn btn-primary btn-sm text-uppercase"
                                        title="Sign in"
                                    >
                                        <i className="fas fa-user"></i>&nbsp; Sign In
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={openRegister}
                                        className="btn btn-link btn-sm text-uppercase"
                                        title="Register"
                                    >
                                        Register
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="dropdown">
                                <a
                                    href="#0"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    title="Account"
                                >
                                    <i className="fas fa-user-circle"></i>&nbsp; {user.username}
                                    <span className="caret-2"><i className="fas fa-chevron-down"></i></span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to="/portfolio">My Profile</Link>
                                    </li>
                                    <li role="separator" className="divider"></li>
                                    <li>
                                        <a href="#logout" onClick={(e) => { e.preventDefault(); onLogout(); }}>Logout</a>
                                    </li>
                                </ul>
                            </li>
                        )}
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

                                {/* Home button */}
                                <li className="active"><Link to="/">Home</Link></li>

                                {/* Portfolio button */}
                                <li>
                                    <Link to="/portfolio">Portfolio</Link>
                                </li>

                                {/* Gallery button */}
                                <li><Link to="/gallery">Gallery</Link></li>

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