import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listPublications, type Publication } from '../../api/publications';
import '../Publications/publications.css';

const ArtistProfile: React.FC = () => {
  const { id } = useParams();
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
//test
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await listPublications({ artist: id as any });
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const artistName = items[0]?.artist_username || `Artiste #${id}`;

  return (
    <div className="publications-page container">
      <h2 className="mb-2">{artistName}</h2>
      <p className="text-muted">Publications de l'artiste</p>

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <div className="row mt-3 g-4">
          {items.map((p) => (
            <div className="col-md-4" key={p.id}>
              <div className="card pub-card h-100">
                {p.image ? (
                  <img src={p.image} className="card-img-top" alt={p.title} />
                ) : (
                  <div className="pub-placeholder">Aucune image</div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{p.title}</h5>
                  <p className="card-text small text-muted">{p.creation_date}</p>
                  {p.description && <p className="card-text">{p.description}</p>}
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p>Aucune publication.</p>}
        </div>
      )}
    </div>
  );
};

export default ArtistProfile;


