import React, { useEffect, useMemo, useState } from 'react';
import { createPublication, deletePublication, listPublications, updatePublication } from '../../api/publications';
import type { Publication } from '../../api/publications';
import { listComments, createComment as apiCreateComment, updateComment as apiUpdateComment, deleteComment as apiDeleteComment, summarizeComments } from '../../api/comments';
import { useAuth } from '../../context/AuthContext';
import './publications.css';

const isoToday = () => new Date().toISOString().slice(0, 10);

const PublicationsPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [creationDate, setCreationDate] = useState(isoToday());
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeComments, setActiveComments] = useState<Record<number, any[]>>({});
  const [newComment, setNewComment] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState<string | null>(null);
  const [showSummaryFor, setShowSummaryFor] = useState<number | null>(null);

  const canWrite = useMemo(() => !!user, [user]);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPublications();
      setItems(data);
    } catch (e: any) {
      setError('Impossible de charger les publications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const loadComments = async (pubId: number) => {
    try {
      const data = await listComments(pubId);
      setActiveComments((prev) => ({ ...prev, [pubId]: data.slice(0, 3) }));
    } catch (_) { /* ignore */ }
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !creationDate) return;
    setSubmitting(true);
    setError(null);
    try {
      await createPublication({ title, creation_date: creationDate, description });
      setTitle('');
      setCreationDate(isoToday());
      setDescription('');
      await fetchAll();
    } catch (e: any) {
      setError("Création impossible (êtes-vous connecté en artiste ?)");
    } finally {
      setSubmitting(false);
    }
  };

  const onOpenEdit = (pub: Publication) => {
    setEditId(pub.id);
    setEditTitle(pub.title);
    setEditDescription(pub.description || '');
    setIsEditing(true);
  };

  const onSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    try {
      await updatePublication(editId, { title: editTitle, description: editDescription });
      setIsEditing(false);
      setEditId(null);
      await fetchAll();
    } catch (_) {
      // ignore
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer cette publication ?')) return;
    try {
      await deletePublication(id);
      await fetchAll();
    } catch (_) {
      // ignore
    }
  };

  const onAddComment = async (pubId: number) => {
    const content = newComment[pubId]?.trim();
    if (!content) return;
    try {
      await apiCreateComment(pubId, content);
      setNewComment((p) => ({ ...p, [pubId]: '' }));
      await loadComments(pubId);
    } catch (_) { /* ignore */ }
  };

  const onDeleteComment = async (pubId: number, commentId: number) => {
    try {
      await apiDeleteComment(commentId);
      await loadComments(pubId);
    } catch (_) { /* ignore */ }
  };

  const onSummarize = async (pubId: number) => {
    setShowSummaryFor(pubId);
    const s = await summarizeComments(pubId);
    setSummary(s || 'Pas de résumé disponible.');
  };

  return (
    <div className="publications-page container">
      <h2 className="mb-4">Publications</h2>

      {canWrite && (
        <div className="pub-form card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="mb-0">Nouvelle publication</h5>
              <span className="badge badge-primary">{items.length} au total</span>
            </div>
            <form onSubmit={onCreate}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Titre</label>
                  <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Date de création</label>
                  <input type="date" className="form-control" value={creationDate} onChange={(e) => setCreationDate(e.target.value)} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Description (utilisée pour générer l'image)</label>
                  <textarea className="form-control" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>
              <div className="mt-3">
                <button className="btn btn-gradient" type="submit" disabled={submitting}>
                  {submitting ? 'Création…' : 'Créer la publication'}
                </button>
              </div>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <div className="row mt-4 g-4">
          {items.map((p) => (
            <div className="col-md-4" key={p.id}>
              <div className="card pub-card h-100">
                <a href={`/publications/${p.id}`}>
                  {p.image ? (
                    <img src={p.image} className="card-img-top pub-thumb" alt={p.title} />
                  ) : (
                    <div className="pub-placeholder">Aucune image</div>
                  )}
                </a>
                <div className="card-body">
                  <h5 className="card-title"><a href={`/publications/${p.id}`}>{p.title}</a></h5>
                  <p className="card-text small text-muted">{p.creation_date}</p>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="small">par</span>
                    <a className="small" href={`/artist/${p.artist}`}>{p.artist_username || `Artiste #${p.artist}`}</a>
                  </div>
                  {p.description && <p className="card-text">{p.description}</p>}
                  {/* Comments preview */}
                  <div className="mt-3">
                    <div className="d-flex gap-2 mb-2">
                      <button className="btn btn-soft btn-sm" onClick={() => loadComments(p.id)}>
                        <i className="fas fa-comments"></i>&nbsp; Voir commentaires
                      </button>
                      <button className="btn btn-soft-info btn-sm" onClick={() => onSummarize(p.id)}>
                        <i className="fas fa-lightbulb"></i>&nbsp; Résumé IA
                      </button>
                    </div>
                    {(activeComments[p.id] || []).map((c: any) => (
                      <div className="comment media mt-2" key={c.id}>
                        <div className="avatar-circle" title={c.author_username ?? c.author}>
                          {(c.author_username ?? String(c.author)).charAt(0).toUpperCase()}
                        </div>
                        <div className="media-body">
                          <div className="comment-header">
                            <strong className="author">{c.author_username ?? c.author}</strong>
                            <span className="dot">•</span>
                            <span className="time small text-muted">{c.created_at ? new Date(c.created_at).toLocaleString() : ''}</span>
                            {user && String(user.id) === String(c.author) && (
                              <button className="btn btn-link btn-xs text-danger ml-auto" onClick={() => onDeleteComment(p.id, c.id)}>Supprimer</button>
                            )}
                          </div>
                          <div className="bubble">
                            {c.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    {user && (
                      <div className="comment composer mt-3">
                        <input className="form-control form-control-sm" placeholder="Ajouter un commentaire" value={newComment[p.id] || ''} onChange={(e) => setNewComment((prev) => ({ ...prev, [p.id]: e.target.value }))} />
                        <button className="btn btn-gradient btn-sm" onClick={() => onAddComment(p.id)}>Envoyer</button>
                      </div>
                    )}
                  </div>
                </div>
                {canWrite && (
                  <div className="card-footer d-flex gap-2">
                    <button className="btn btn-primary btn-sm" onClick={() => onOpenEdit(p)}>Modifier</button>
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(p.id)}>Supprimer</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && <p>Aucune publication.</p>}
        </div>
      )}

      {/* Simple edit modal */}
      {isEditing && (
        <div className="modal-backdrop-custom">
          <div className="modal-card">
            <div className="modal-card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Modifier la publication</h5>
              <button className="btn btn-link" onClick={() => setIsEditing(false)}>×</button>
            </div>
            <div className="modal-card-body">
              <form onSubmit={onSubmitEdit}>
                <div className="form-group mb-3">
                  <label className="form-label">Titre</label>
                  <input className="form-control" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-gradient">Enregistrer</button>
                  <button type="button" className="btn btn-cancel" onClick={() => setIsEditing(false)}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image preview lightbox */}
      {previewUrl && (
        <div className="modal-backdrop-custom" onClick={() => setPreviewUrl(null)}>
          <div className="modal-image" onClick={(e) => e.stopPropagation()}>
            <img src={previewUrl} alt="aperçu" />
            <button className="btn btn-cancel close-btn" onClick={() => setPreviewUrl(null)}>Fermer</button>
          </div>
        </div>
      )}

      {/* Summary modal */}
      {showSummaryFor !== null && (
        <div className="modal-backdrop-custom" onClick={() => { setShowSummaryFor(null); setSummary(null); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card-header d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <span className="summary-icon"><i className="fas fa-lightbulb"></i></span>
                <strong>Résumé des commentaires</strong>
              </div>
              <button className="btn btn-cancel" onClick={() => { setShowSummaryFor(null); setSummary(null); }}>Fermer</button>
            </div>
            <div className="modal-card-body">
              {summary ? (
                <div className="summary-card">
                  <pre className="summary-text">{summary}</pre>
                  <div className="summary-actions">
                    <button className="btn btn-soft-info btn-sm" onClick={() => navigator.clipboard.writeText(summary || '')}>
                      <i className="fas fa-copy"></i>&nbsp; Copier
                    </button>
                  </div>
                </div>
              ) : (
                <div className="summary-loading">
                  <i className="fas fa-spinner fa-spin"></i>&nbsp; Génération du résumé…
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationsPage;


