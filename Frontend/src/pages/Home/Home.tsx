import { Link } from 'react-router-dom';
import './home.css';
import { useEffect, useState } from 'react';
import { listPublications, type Publication } from '../../api/publications';

const Home = () => {
    const [items, setItems] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await listPublications();
                setItems(data);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="home-fullbleed">
            <section id="content-section" className="no-padding">
                <div className="content-wrap no-padding">
                    <div className="container" style={{ padding: '2rem 0' }}>
                        <h2 className="mb-2">Dernières publications</h2>
                        <p className="text-muted">Découvrez les œuvres publiées récemment par nos artistes.</p>

                        {loading ? (
                            <p>Chargement…</p>
                        ) : (
                            <div className="row mt-3 g-4">
                                {items.slice(0, 12).map((p) => (
                                    <div className="col-md-4" key={p.id}>
                                        <div className="card pub-card h-100">
                                            <Link to={`/publications/${p.id}`}>
                                                {p.image ? (
                                                    <img src={p.image} className="card-img-top" alt={p.title} />
                                                ) : (
                                                    <div className="pub-placeholder">Aucune image</div>
                                                )}
                                            </Link>
                                            <div className="card-body">
                                                <h5 className="card-title"><Link to={`/publications/${p.id}`}>{p.title}</Link></h5>
                                                <p className="card-text small text-muted">{p.creation_date}</p>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="small">par</span>
                                                    <Link to={`/artist/${p.artist}`} className="small">
                                                        {p.artist_username || `Artiste #${p.artist}`}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {items.length === 0 && <p>Aucune publication.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;