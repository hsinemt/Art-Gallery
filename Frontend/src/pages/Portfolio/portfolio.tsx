import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './portfolio.css';

const Portfolio = () => {
    const [showMore, setShowMore] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const portfolioItems = [
        { 
            id: 1, 
            title: 'Abstract Dreams', 
            subtitle: '#abstract', 
            image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
            thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
            favorites: 69 
        },
        { 
            id: 2, 
            title: 'Vibrant Expression', 
            subtitle: '#modern', 
            image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
            thumb: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400',
            favorites: 56 
        },
        { 
            id: 3, 
            title: 'Gallery Wall', 
            subtitle: '#exhibition', 
            image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
            thumb: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
            favorites: 79
        },
        { 
            id: 4, 
            title: 'Color Spectrum', 
            subtitle: '#contemporary', 
            image: 'https://images.unsplash.com/photo-1577720643272-265f08b37a8f?w=800',
            thumb: 'https://images.unsplash.com/photo-1577720643272-265f08b37a8f?w=400',
            favorites: 188 
        },
        { 
            id: 5, 
            title: 'Artistic Vision', 
            subtitle: '#creative', 
            image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
            thumb: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400',
            favorites: 41 
        },
        { 
            id: 6, 
            title: 'Urban Canvas', 
            subtitle: '#street art', 
            image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800',
            thumb: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400',
            favorites: 97 
        },
        { 
            id: 7, 
            title: 'Museum Masterpiece', 
            subtitle: '#classic', 
            image: 'https://images.unsplash.com/photo-1574181566161-5ddf6e6b48a7?w=800',
            thumb: 'https://images.unsplash.com/photo-1574181566161-5ddf6e6b48a7?w=400',
            favorites: 254 
        },
        { 
            id: 8, 
            title: 'Modern Strokes', 
            subtitle: '#painting', 
            image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800',
            thumb: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400',
            favorites: 113 
        },
        { 
            id: 9, 
            title: 'Mural Magic', 
            subtitle: '#street art', 
            image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800',
            thumb: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400',
            favorites: 80 
        },
        { 
            id: 10, 
            title: 'Canvas Creation', 
            subtitle: '#studio', 
            image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
            thumb: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
            favorites: 163 
        },
        { 
            id: 11, 
            title: 'Artistic Splash', 
            image: 'https://images.unsplash.com/photo-1577720580479-d9b4b8c7a3c4?w=800',
            thumb: 'https://images.unsplash.com/photo-1577720580479-d9b4b8c7a3c4?w=400',
            subtitle: '#watercolor', 
            favorites: 97 
        },
        //test
        { 
            id: 12, 
            title: 'Gallery Display', 
            subtitle: '#exhibition', 
            image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
            thumb: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400',
            favorites: 22 
        },
        { 
            id: 13, 
            title: 'Palette Harmony', 
            subtitle: '#colors', 
            image: 'https://images.unsplash.com/photo-1580136607984-bb909f8d883a?w=800',
            thumb: 'https://images.unsplash.com/photo-1580136607984-bb909f8d883a?w=400',
            favorites: 174 
        },
        { 
            id: 14, 
            title: 'Abstract Forms', 
            subtitle: '#modern', 
            image: 'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=800',
            thumb: 'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=400',
            favorites: 76 
        },
        { 
            id: 15, 
            title: 'Creative Expression', 
            subtitle: '#contemporary', 
            image: 'https://images.unsplash.com/photo-1560015534-cee980ba7e13?w=800',
            thumb: 'https://images.unsplash.com/photo-1560015534-cee980ba7e13?w=400',
            favorites: 132 
        }
    ];

    // Add horizontal scroll with mouse wheel
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleWheel = (e: WheelEvent) => {
            // Prevent default vertical scroll
            e.preventDefault();

            // Scroll horizontally instead
            scrollContainer.scrollLeft += e.deltaY;
        };

        scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            scrollContainer.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div className="portfolio-fullbleed">
            {/* Page Header Section */}
            <section id="page-header-secion" className="alter-heading">
                <div
                    className="page-header-image parallax bg-image"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1579762715459-5a068c289fda?w=1600)',
                        backgroundPosition: '50% 50%'
                    }}
                ></div>
                <div className="cover page-header-cover"></div>

                <div className="container-fluid page-header-content no-padding text-center">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="album-title">Portfolio Gallery</h1>
                            <ol className="breadcrumb">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/portfolio">Portfolio</Link></li>
                                <li className="active">Gallery Collection</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section id="content-section" className="portfolio-single portfolio-single-1">
                <div className="content-wrap">
                    <div className="container-fluid">
                        <div className="row">

                            {/* Left Column - Portfolio Info */}
                            <div className="col-left col-md-4 col-lg-3 f-height">
                                <div className="portfolio-info">
                                    <div className="portfolio-info-inner">

                                        <h1 className="portfolio-title">About Project:</h1>

                                        {/* Portfolio Meta */}
                                        <div className="album-meta">
                                            <span className="photos-count">15 Photos</span> /
                                            <span className="photos-views">1246 Views</span>
                                        </div>

                                        {/* Author */}
                                        <div className="author">
                                            <a
                                                href="#"
                                                className="author-avatar bg-image"
                                                style={{
                                                    backgroundImage: 'url(https://i.pravatar.cc/150?img=12)',
                                                    backgroundPosition: '50% 50%'
                                                }}
                                            ></a>
                                            <a href="#" className="author-info">- Author: Art Gallery</a>
                                        </div>

                                        {/* Portfolio Description */}
                                        <div className="album-description margin-top-20">
                                            <div className="al-desc-inner">
                                                <p>A curated collection of contemporary art pieces showcasing diverse styles, from abstract expressionism to modern urban art. Each piece tells a unique story.</p>

                                                {/* Description Toggle */}
                                                {showMore && (
                                                    <div className="al-desc-toggle">
                                                        <p>This portfolio features works from emerging and established artists, exploring themes of color, form, and cultural expression. Browse through our carefully selected collection.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Toggle Trigger */}
                                            <div
                                                className="al-desc-toggle-trigger"
                                                onClick={() => setShowMore(!showMore)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {showMore ? (
                                                    <span className="al-desc-less">
                                                        <i className="fas fa-chevron-up"></i> Less
                                                    </span>
                                                ) : (
                                                    <span className="al-desc-more">
                                                        <i className="fas fa-chevron-down"></i> More
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Portfolio Attributes */}
                                        <div className="portfolio-atr margin-top-30">
                                            <ul className="list-unstyled">
                                                <li>
                                                    <h4 className="head">Gallery:</h4>
                                                    <span className="info">Art Gallery Collection</span>
                                                </li>

                                                <li>
                                                    <h4 className="head">Website:</h4>
                                                    <span className="info">
                                                        <a target="_blank" href="#" rel="noopener noreferrer">
                                                            www.artgallery.com
                                                        </a>
                                                    </span>
                                                </li>

                                                <li>
                                                    <h4 className="head">Category:</h4>
                                                    <span className="info"><a href="#">contemporary</a></span>,
                                                    <span className="info"><a href="#">abstract</a></span>,
                                                    <span className="info"><a href="#">modern</a></span>
                                                </li>

                                                {/* Portfolio Share */}
                                                <li className="portfolio-share">
                                                    <h4 className="head">Share:</h4>
                                                    <span className="info">
                                                        <a href="#0" title="Share to Facebook">
                                                            <i className="fab fa-facebook-f"></i>
                                                        </a>
                                                    </span>
                                                    <span className="info">
                                                        <a href="#0" title="Share to Twitter">
                                                            <i className="fab fa-twitter"></i>
                                                        </a>
                                                    </span>
                                                    <span className="info">
                                                        <a href="#0" title="Share to Google Plus">
                                                            <i className="fab fa-google-plus-g"></i>
                                                        </a>
                                                    </span>
                                                    <span className="info">
                                                        <a href="#0" title="Share to Pinterest">
                                                            <i className="fab fa-pinterest-p"></i>
                                                        </a>
                                                    </span>
                                                    <span className="info">
                                                        <a href="#0" title="Share to Instagram">
                                                            <i className="fab fa-instagram"></i>
                                                        </a>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>

                                    {/* Portfolio Info Bottom */}
                                    <div className="portfolio-info-bottom">
                                        <ul className="album-attributes margin-top-40">
                                            <li className="pull-left">
                                                <Link className="back-to-list" to="/portfolio">
                                                    <span className="bta-icon"><i className="fas fa-th-list"></i></span>
                                                    <span className="bta-text">Back to list</span>
                                                </Link>
                                            </li>

                                            {/* Portfolio Nav */}
                                            <li className="portfolio-nav pull-right">
                                                <Link to="/portfolio/2" className="pn-link portf-next" title="Next work">
                                                    <span className="pn-link-text hide-from-sm">Next</span>
                                                    <span className="pn-link-icon"><i className="fas fa-chevron-right"></i></span>
                                                </Link>
                                            </li>

                                            <li className="portfolio-nav pull-right">
                                                <Link to="/portfolio/5" className="pn-link portf-prev margin-right-15" title="Previous work">
                                                    <span className="pn-link-icon"><i className="fas fa-chevron-left"></i></span>
                                                    <span className="pn-link-text hide-from-sm">Prev</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Gallery */}
                            <div className="col-right col-md-8 col-lg-9">
                                <div id="gallery" className="lightgallery f-height hover-simple">

                                    {/* Horizontal Scroll Carousel */}
                                    <div
                                        ref={scrollContainerRef}
                                        className="owl-carousel owl-mousewheel dots-rounded dots-outside nav-rounded nav-outside"
                                    >

                                        {portfolioItems.map((item) => (
                                            <div key={item.id} className="album-single-item">
                                                <div
                                                    className="full-cover bg-image"
                                                    style={{
                                                        backgroundImage: `url(${item.image})`,
                                                        backgroundPosition: '50% 50%',
                                                        backgroundSize: 'cover'
                                                    }}
                                                ></div>

                                                <div className="asi-cover">
                                                    <a
                                                        className="asi-link lg-trigger"
                                                        href={item.image}
                                                        data-exthumbnail={item.thumb}
                                                        data-sub-html={`<h4>${item.title}</h4><p>A stunning piece from our curated art collection.</p>`}
                                                    >
                                                        <div className="asi-info">
                                                            <h2 className="asi-title">{item.title}</h2>
                                                            <h5 className="asi-sub-title">{item.subtitle}</h5>
                                                        </div>
                                                    </a>

                                                    {/* Favorite Button */}
                                                    <div className="favorite-btn">
                                                        <div className="fav-inner">
                                                            <div className="icon-heart">
                                                                <span className="icon-heart-empty"></span>
                                                                <span className="icon-heart-filled"></span>
                                                            </div>
                                                        </div>
                                                        <div className="fav-count">{item.favorites}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Portfolio;
