import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublication, type Publication } from '../../api/publications';
import { listComments, createComment, updateComment, deleteComment, summarizeComments, type Comment } from '../../api/comments';
import './publications.css';

const PublicationDetail: React.FC = () => {
  const { id } = useParams();
  const pubId = Number(id);

  const [pub, setPub] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryDetail, setSummaryDetail] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        getPublication(pubId),
        listComments(pubId),
      ]);
      setPub(p);
      setComments(c);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(pubId)) return;
    loadAll();
  }, [pubId]);

  const onAdd = async () => {
    const content = newComment.trim();
    if (!content) return;
    await createComment(pubId, content);
    setNewComment('');
    await loadAll();
  };

  const onEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditingText(c.content);
  };

  const onSaveEdit = async () => {
    if (!editingId) return;
    await updateComment(editingId, editingText);
    setEditingId(null);
    setEditingText('');
    await loadAll();
  };

  const onDelete = async (cid: number) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    await deleteComment(cid);
    await loadAll();
  };

  const onSummarize = async () => {
    const res = await summarizeComments(pubId);
    setSummary(res.summary || null);
    setSummaryDetail(res.detail ?? null);
  };

  if (!Number.isFinite(pubId)) return <div className="container" style={{padding:'2rem 0'}}>ID invalide</div>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      {loading ? (
        <p>Chargement…</p>
      ) : !pub ? (
        <p>Publication introuvable.</p>
      ) : (
        <>
          <div className="row g-4">
            <div className="col-md-6">
              {pub.image ? (
                <img src={pub.image} alt={pub.title} className="img-fluid rounded" />
              ) : (
                <div className="pub-placeholder">Aucune image</div>
              )}
            </div>
            <div className="col-md-6">
              <h2 className="mb-1">{pub.title}</h2>
              <div className="mb-2 text-muted small">{pub.creation_date}</div>
              <div className="mb-3">{pub.description}</div>
              <div className="mb-3">
                <span className="small">par </span>
                <Link to={`/artist/${pub.artist}`} className="small">{pub.artist_username || `Artiste #${pub.artist}`}</Link>
              </div>
              <button className="btn btn-soft-info btn-sm" onClick={onSummarize}>
                <i className="fas fa-lightbulb"></i>&nbsp; Résumé IA
              </button>
              {summary && (
                <div className="summary-card mt-2">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="summary-icon"><i className="fas fa-lightbulb"></i></span>
                    <strong>Résumé</strong>
                    <button className="btn btn-soft-info btn-xs ml-auto" onClick={() => navigator.clipboard.writeText(summary || '')}>
                      <i className="fas fa-copy"></i>&nbsp; Copier
                    </button>
                  </div>
                  <pre className="summary-text">{summary}</pre>
                </div>
              )}
              {!summary && summaryDetail && <div className="summary-card mt-2 warning">{summaryDetail}</div>}
            </div>
          </div>

          <div className="mt-4 pub-form card">
            <div className="card-body">
              <h5 className="mb-3">Commentaires</h5>
              <div className="comment composer mb-3">
                <input className="form-control" placeholder="Ajouter un commentaire" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <button className="btn btn-gradient" onClick={onAdd}>Envoyer</button>
              </div>

              {comments.map((c) => (
                <div className="comment media mb-2" key={c.id}>
                  <div className="avatar-circle" title={c.author_username ?? c.author}>
                    {(c.author_username ?? String(c.author)).charAt(0).toUpperCase()}
                  </div>
                  <div className="media-body">
                    <div className="comment-header">
                      <strong className="author">{c.author_username ?? c.author}</strong>
                      <span className="dot">•</span>
                      <span className="time small text-muted">{c.created_at ? new Date(c.created_at).toLocaleString() : ''}</span>
                      <div className="actions ml-auto">
                        {editingId !== c.id ? (
                          <>
                            <button className="btn btn-link btn-xs p-0 mr-2" onClick={() => onEdit(c)}>Modifier</button>
                            <button className="btn btn-link btn-xs p-0 text-danger" onClick={() => onDelete(c.id)}>Supprimer</button>
                          </>
                        ) : null}
                      </div>
                    </div>
                    {editingId === c.id ? (
                      <div className="mt-2">
                        <textarea className="form-control" rows={2} value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                        <div className="mt-2 d-flex gap-2">
                          <button className="btn btn-gradient btn-sm" onClick={onSaveEdit}>Enregistrer</button>
                          <button className="btn btn-cancel btn-sm" onClick={() => { setEditingId(null); setEditingText(''); }}>Annuler</button>
                        </div>
                      </div>
                    ) : (
                      <div className="bubble mt-1">{c.content}</div>
                    )}
                  </div>
                </div>
              ))}
              {comments.length === 0 && <p className="text-muted">Aucun commentaire.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PublicationDetail;


