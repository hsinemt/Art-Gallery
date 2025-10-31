import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
    // Create 40 images for the photo wall
    const images = Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        src: `/assets/img/album-list/small/img-${i + 1}.jpg`,
        link: '/album-single-masonry-4col'
    }));

    return (
        <div className="home-fullbleed">
            <section id="content-section" className="no-padding">
                <div className="content-wrap no-padding">
                    {/* Photo Wall - Using theme CSS classes */}
                    <div className="photo-wall full-page gutter-1">
                        {images.map((image) => (
                            <Link key={image.id} to={image.link} className="pw-item">
                                <div
                                    className="pw-item-img bg-image"
                                    style={{
                                        backgroundImage: `url(${image.src})`,
                                        backgroundPosition: '50% 50%'
                                    }}
                                >
                                    <div className="cover"></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;