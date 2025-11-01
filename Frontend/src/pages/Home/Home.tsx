import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
    // Art photos from Unsplash (free to use)
    const images = [
        { id: 1, src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500', title: 'Abstract Art' },
        { id: 2, src: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=500', title: 'Modern Painting' },
        { id: 3, src: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500', title: 'Gallery Wall' },
        { id: 4, src: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=500', title: 'Street Art' },
        { id: 5, src: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500', title: 'Contemporary Art' },
        { id: 6, src: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=500', title: 'Museum Art' },
        { id: 7, src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500', title: 'Classic Painting' },
        { id: 8, src: 'https://images.unsplash.com/photo-1577720643272-265f28b6c29c?w=500', title: 'Art Exhibition' },
        { id: 9, src: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=500', title: 'Abstract Canvas' },
        { id: 10, src: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500', title: 'Art Display' },
        { id: 11, src: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=500', title: 'Artistic Photo' },
        { id: 12, src: 'https://images.unsplash.com/photo-1574376286891-251dc8e0ce5e?w=500', title: 'Gallery Art' },
        { id: 13, src: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500', title: 'Wall Art' },
        { id: 14, src: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500', title: 'Modern Gallery' },
        { id: 15, src: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=500', title: 'Colorful Art' },
        { id: 16, src: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=500', title: 'Art Installation' },
        { id: 17, src: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=500', title: 'Urban Art' },
        { id: 18, src: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=500', title: 'Artistic Work' },
        { id: 19, src: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=500', title: 'Creative Art' },
        { id: 20, src: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=500', title: 'Art Piece' },
        { id: 21, src: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500', title: 'Exhibition' },
        { id: 22, src: 'https://images.unsplash.com/photo-1577720643272-265f28b6c29c?w=500', title: 'Museum Piece' },
        { id: 23, src: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=500', title: 'Canvas Art' },
        { id: 24, src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500', title: 'Abstract Work' },
        { id: 25, src: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500', title: 'Gallery Display' },
        { id: 26, src: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500', title: 'Contemporary' },
        { id: 27, src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500', title: 'Classic Art' },
        { id: 28, src: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=500', title: 'Art Show' },
        { id: 29, src: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=500', title: 'Modern Art' },
        { id: 30, src: 'https://images.unsplash.com/photo-1574376286891-251dc8e0ce5e?w=500', title: 'Artistic Display' },
        { id: 31, src: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=500', title: 'Photo Art' },
        { id: 32, src: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500', title: 'Wall Display' },
        { id: 33, src: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500', title: 'Gallery View' },
        { id: 34, src: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=500', title: 'Art Space' },
        { id: 35, src: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=500', title: 'Creative Display' },
        { id: 36, src: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=500', title: 'Artistic Creation' },
        { id: 37, src: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=500', title: 'Art Collection' },
        { id: 38, src: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500', title: 'Fine Art' },
        { id: 39, src: 'https://images.unsplash.com/photo-1577720643272-265f28b6c29c?w=500', title: 'Art Gallery' },
        { id: 40, src: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=500', title: 'Visual Art' },
    ];

    return (
        <div className="home-fullbleed">
            <section id="content-section" className="no-padding">
                <div className="content-wrap no-padding">
                    {/* Photo Wall - Using theme CSS classes */}
                    <div className="photo-wall full-page gutter-1">
                        {images.map((image) => (
                            <Link key={image.id} to="/album-single-masonry-4col" className="pw-item">
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
