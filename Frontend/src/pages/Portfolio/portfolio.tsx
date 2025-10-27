import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './portfolio.css';

const Portfolio = () => {
    const [showMore, setShowMore] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const portfolioItems = [
        { id: 1, title: 'Lana Melray', subtitle: '#fashion', image: 'img-1.jpg', favorites: 69 },
        { id: 2, title: 'Meric ac Setre', subtitle: '#fashion', image: 'img-2.jpg', favorites: 56 },
        { id: 3, title: 'Nertes Mavera Tatum', subtitle: '#portraits', image: 'img-3.jpg', favorites: 79, isVideo: true, videoUrl: 'https://www.youtube.com/watch?v=meBbDqAXago' },
        { id: 4, title: 'Kazek Maites', subtitle: '#portraits', image: 'img-4.jpg', favorites: 188 },
        { id: 5, title: 'Embila Sent Tarum', subtitle: '#portraits', image: 'img-5.jpg', favorites: 41 },
        { id: 6, title: 'Neveck Kanis', subtitle: '#outdoor', image: 'img-6.jpg', favorites: 97 },
        { id: 7, title: 'Satera Vatum', subtitle: '#outdoor', image: 'img-7.jpg', favorites: 254 },
        { id: 8, title: 'Etna Manick', subtitle: '#outdoor', image: 'img-8.jpg', favorites: 113 },
        { id: 9, title: 'Tzitra Vat Torres', subtitle: '#black & white', image: 'img-9.jpg', favorites: 80 },
        { id: 10, title: 'Narrat Lacus', subtitle: '#black & white', image: 'img-10.jpg', favorites: 163 },
        { id: 11, title: 'Meteora Nazek', subtitle: '#black & white', image: 'img-11.jpg', favorites: 97 },
        { id: 12, title: 'Vertinus Nav Esse', subtitle: '#black & white', image: 'img-12.jpg', favorites: 22 },
        { id: 13, title: 'Vateck at Maneck', subtitle: '#black & white', image: 'img-13.jpg', favorites: 174 },
        { id: 14, title: 'Axo Lotus', subtitle: '#black & white', image: 'img-14.jpg', favorites: 76 },
        { id: 15, title: 'Verenna Lotus', subtitle: '#creative', image: 'img-15.jpg', favorites: 132 }
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
                        backgroundImage: 'url(/assets/img/headings/heading-5.jpg)',
                        backgroundPosition: '50% 50%'
                    }}
                ></div>
                <div className="cover page-header-cover"></div>

                <div className="container-fluid page-header-content no-padding text-center">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="album-title">Portfolio Single V.1</h1>
                            <ol className="breadcrumb">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/portfolio">Portfolio</Link></li>
                                <li className="active">Portfolio Single V.1</li>
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
                                                    backgroundImage: 'url(/assets/img/author.jpg)',
                                                    backgroundPosition: '50% 50%'
                                                }}
                                            ></a>
                                            <a href="#" className="author-info">- Author: John Smith</a>
                                        </div>

                                        {/* Portfolio Description */}
                                        <div className="album-description margin-top-20">
                                            <div className="al-desc-inner">
                                                <p>Suspendisse metus urna, faucibus nec ex et, suscipit blandit turpis. Suspendisse maximus sodales sem aliquet vehicula.</p>

                                                {/* Description Toggle */}
                                                {showMore && (
                                                    <div className="al-desc-toggle">
                                                        <p>Praesent ultricies interdum augue sit amet tempor. Maecenas at ultricies arcu. Sed lacinia vulputate nulla, at sollicitudin.</p>
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
                                                    <h4 className="head">Client:</h4>
                                                    <span className="info">Sirabella´s Photography</span>
                                                </li>

                                                <li>
                                                    <h4 className="head">Website:</h4>
                                                    <span className="info">
                                                        <a target="_blank" href="http://www.sirabella.ee/" rel="noopener noreferrer">
                                                            www.sirabella.ee
                                                        </a>
                                                    </span>
                                                </li>

                                                <li>
                                                    <h4 className="head">Category:</h4>
                                                    <span className="info"><a href="#">models</a></span>,
                                                    <span className="info"><a href="#">portraits</a></span>
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
                                                        backgroundImage: `url(/assets/img/album-single/masonry/${item.image})`,
                                                        backgroundPosition: '50% 50%'
                                                    }}
                                                ></div>

                                                <div className="asi-cover">
                                                    <a
                                                        className="asi-link lg-trigger"
                                                        href={item.isVideo ? item.videoUrl : `/assets/img/album-single/big/${item.image}`}
                                                        data-exthumbnail={`/assets/img/album-single/thumb/${item.image}`}
                                                        data-sub-html={`<h4>${item.title}</h4><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>`}
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