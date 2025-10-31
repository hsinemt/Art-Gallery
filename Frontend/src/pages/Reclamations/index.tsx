import { useState, useEffect } from 'react';
import type { Reclamation, User } from '../../types';
import { reclamationService } from '../../api/reclamation/reclamationService';
import { userService } from '../../api/users/userService';
import { useAuth } from '../../context/AuthContext';
import PageLayout from '../../component/Layout/PageLayout';
import Modal from '../../component/Modal/Modal';

const ReclamationsPage = () => {
    const [reclamations, setReclamations] = useState<Reclamation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'all'>('received');
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedReclamation, setSelectedReclamation] = useState<Reclamation | null>(null);
    const { user, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        sujet: 'system' as 'system' | 'user',
        cible_id: undefined as number | undefined,
        contenu: ''
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState({
        sujet: 'system' as 'system' | 'user',
        cible_id: undefined as number | undefined,
        contenu: ''
    });

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setIsAdmin(false);
            return;
        }

        const checkAdmin = async () => {
            try {
                const adminStatus = await userService.isAdmin();
                setIsAdmin(adminStatus);
            } catch (err) {
                setIsAdmin(false);
            }
        };
        checkAdmin();
    }, [authLoading, user]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersList = await userService.getAllUsers();
                // Exclure l'admin de la liste (filtre robuste)
                const filtered = usersList.filter(u => !(u.is_superuser === true || u.is_staff === true || u.username === 'admin'));
                setUsers(filtered);
            } catch (err) {
                console.error('Failed to load users list', err);
            }
        };
        loadUsers();
    }, []);

    useEffect(() => {
        if (authLoading) return;
        if (!user) return;
        loadReclamations();
    }, [activeTab, authLoading, user, isAdmin]);

    const loadReclamations = async () => {
        setLoading(true);
        try {
            let data;
            if (isAdmin && activeTab === 'all') {
                data = await reclamationService.getAllReclamations();
            } else if (activeTab === 'received') {
                data = await reclamationService.getReceivedReclamations();
            } else {
                data = await reclamationService.getSentReclamations();
            }
            setReclamations(data);
            setError(null);
        } catch (err: any) {
            const errorMsg = err?.response?.data?.detail || 'Erreur lors du chargement des réclamations';
            setError(errorMsg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Map local form shape (cible_id) to API shape (cible)
            const payload: any = {
                sujet: formData.sujet,
                contenu: formData.contenu,
            };
            if (formData.sujet === 'user' && formData.cible_id) {
                payload.cible = formData.cible_id;
            }

            await reclamationService.createReclamation(payload);
            setFormData({ sujet: 'system', cible_id: undefined, contenu: '' });
            await loadReclamations();
            setError(null);
        } catch (err: any) {
            if (err?.response?.data) {
                const errorData = err.response.data;
                // Format validation errors
                if (typeof errorData === 'object') {
                    const errorMessages = Object.entries(errorData)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ');
                    setError(errorMessages);
                } else {
                    setError(JSON.stringify(errorData));
                }
            } else {
                setError('Erreur lors de la création de la réclamation');
            }
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
            return;
        }

        try {
            await reclamationService.deleteReclamation(id);
            await loadReclamations();
            setError(null);
        } catch (err: any) {
            const errorMsg = err?.response?.data?.detail || 'Erreur lors de la suppression de la réclamation';
            setError(errorMsg);
            console.error(err);
        }
    };

    const handleEditClick = (reclamation: Reclamation) => {
        setEditingId(reclamation.id);
        setEditData({
            sujet: reclamation.sujet,
            cible_id: reclamation.cible?.id,
            contenu: reclamation.contenu
        });
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditData({ sujet: 'system', cible_id: undefined, contenu: '' });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;
        try {
            const payload: any = {
                sujet: editData.sujet,
                contenu: editData.contenu,
            };
            if (editData.sujet === 'user' && editData.cible_id) {
                payload.cible = editData.cible_id;
            } else {
                payload.cible = null;
            }
            await reclamationService.updateReclamation(editingId, payload);
            setEditingId(null);
            setEditData({ sujet: 'system', cible_id: undefined, contenu: '' });
            await loadReclamations();
            setError(null);
        } catch (err: any) {
            if (err?.response?.data) {
                const errorData = err.response.data;
                // Format validation errors
                if (typeof errorData === 'object') {
                    const errorMessages = Object.entries(errorData)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ');
                    setError(errorMessages);
                } else {
                    setError(JSON.stringify(errorData));
                }
            } else {
                setError('Erreur lors de la modification de la réclamation');
            }
            console.error(err);
        }
    };

    const getSentimentBadge = (sentiment: string) => {
        const sentimentLower = sentiment.toLowerCase();
        if (sentimentLower.includes('positive')) {
            return <span className="badge badge-success">Positif</span>;
        } else if (sentimentLower.includes('negative')) {
            return <span className="badge badge-danger">Négatif</span>;
        } else {
            return <span className="badge badge-warning">Neutre</span>;
        }
    };

    const getRiskBadge = (emotions: any) => {
        if (!emotions || !emotions.risk_level) return null;
        
        const riskColors: { [key: string]: string } = {
            'HIGH': 'danger',
            'MEDIUM': 'warning',
            'LOW': 'info',
            'MINIMAL': 'secondary'
        };

        const riskEmojis: { [key: string]: string } = {
            'HIGH': '🔴',
            'MEDIUM': '🟠',
            'LOW': '🟡',
            'MINIMAL': '🟢'
        };

        const risk = emotions.risk_level;
        return (
            <span className={`badge badge-${riskColors[risk] || 'secondary'}`}>
                {riskEmojis[risk]} {risk}
            </span>
        );
    };

    // While auth is resolving show a spinner to avoid rendering null/undefined data
    if (authLoading) {
        return (
            <PageLayout title="Gestion des Réclamations">
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Chargement...</span>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (!user) {
        return (
            <PageLayout title="Gestion des Réclamations">
                <div className="alert alert-warning">
                    Veuillez vous connecter pour accéder aux réclamations.
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Gestion des Réclamations">
            {/* Formulaire de création */}
            <div className="card mb-4">
                <div className="card-header">
                    <h4>Nouvelle Réclamation</h4>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Sujet de la réclamation</label>
                            <select
                                className="form-control"
                                value={formData.sujet}
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    sujet: e.target.value as 'system' | 'user',
                                    cible_id: e.target.value === 'system' ? undefined : formData.cible_id 
                                })}
                                required
                            >
                                <option value="system">Système</option>
                                <option value="user">Utilisateur</option>
                            </select>
                        </div>

                        {formData.sujet === 'user' && (
                            <div className="form-group">
                                <label>Sélectionner l'utilisateur</label>
                                <select
                                    className="form-control"
                                    value={formData.cible_id || ''}
                                    onChange={(e) => setFormData({ 
                                        ...formData, 
                                        cible_id: e.target.value ? parseInt(e.target.value) : undefined 
                                    })}
                                    required
                                >
                                    <option value="">Sélectionnez un utilisateur</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Contenu de la réclamation</label>
                            <textarea
                                className="form-control"
                                rows={4}
                                value={formData.contenu}
                                onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                                required
                                placeholder="Décrivez votre réclamation..."
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Envoyer la réclamation
                        </button>
                    </form>
                </div>
            </div>

            {/* Formulaire d'édition inline */}
            {editingId && (
                <div className="card mb-4 border-warning">
                    <div className="card-header bg-warning text-dark">
                        <h5>Modifier la Réclamation</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>Sujet de la réclamation</label>
                                <select
                                    className="form-control"
                                    value={editData.sujet}
                                    onChange={(e) => setEditData({
                                        ...editData,
                                        sujet: e.target.value as 'system' | 'user',
                                        cible_id: e.target.value === 'system' ? undefined : editData.cible_id
                                    })}
                                    required
                                >
                                    <option value="system">Système</option>
                                    <option value="user">Utilisateur</option>
                                </select>
                            </div>
                            {editData.sujet === 'user' && (
                                <div className="form-group">
                                    <label>Sélectionner l'utilisateur</label>
                                    <select
                                        className="form-control"
                                        value={editData.cible_id || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            cible_id: e.target.value ? parseInt(e.target.value) : undefined
                                        })}
                                        required
                                    >
                                        <option value="">Sélectionnez un utilisateur</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>
                                                {u.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="form-group">
                                <label>Contenu de la réclamation</label>
                                <textarea
                                    className="form-control"
                                    rows={4}
                                    value={editData.contenu}
                                    onChange={(e) => setEditData({ ...editData, contenu: e.target.value })}
                                    required
                                    placeholder="Décrivez votre réclamation..."
                                />
                            </div>
                            <button type="submit" className="btn btn-success mr-2">Enregistrer</button>
                            <button type="button" className="btn btn-secondary" onClick={handleEditCancel}>Annuler</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Onglets pour filtrer les réclamations */}
            <div className="card">
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'received' ? 'active' : ''}`}
                                onClick={() => setActiveTab('received')}
                            >
                                Reçues {activeTab === 'received' && `(${reclamations.length})`}
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'sent' ? 'active' : ''}`}
                                onClick={() => setActiveTab('sent')}
                            >
                                Envoyées {activeTab === 'sent' && `(${reclamations.length})`}
                            </button>
                        </li>
                        {isAdmin && (
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('all')}
                                >
                                    Toutes {activeTab === 'all' && `(${reclamations.length})`}
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Chargement...</span>
                            </div>
                        </div>
                    ) : reclamations.length === 0 ? (
                        <div className="alert alert-info">
                            Aucune réclamation {activeTab === 'received' ? 'reçue' : 'envoyée'}.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="thead-light">
                                    <tr>
                                        <th>Date</th>
                                            {isAdmin ? (
                                                <>
                                                    <th>Auteur</th>
                                                    <th>Cible</th>
                                                </>
                                            ) : (
                                                <th>{activeTab === 'received' ? 'De' : 'À'}</th>
                                            )}
                                        <th>Sujet</th>
                                        <th>Contenu</th>
                                        {isAdmin && <th>Sentiment</th>}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reclamations.map((reclamation) => (
                                        <tr 
                                            key={reclamation.id} 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setSelectedReclamation(reclamation)}
                                        >
                                            <td>{reclamation.date_creation ? new Date(reclamation.date_creation).toLocaleDateString('fr-FR') : '—'}</td>
                                                {isAdmin ? (
                                                    <>
                                                        <td><strong>{reclamation.auteur?.username || '—'}</strong></td>
                                                        <td><strong>{reclamation.cible?.username || '_'}</strong></td>
                                                    </>
                                                ) : (
                                                    <td>
                                                        <strong>
                                                            {activeTab === 'received'
                                                                ? (reclamation.auteur?.username || '—')
                                                                : (reclamation.cible?.username || 'Système')}
                                                        </strong>
                                                    </td>
                                                )}
                                            <td>
                                                <span className={`badge badge-${reclamation.sujet === 'system' ? 'primary' : 'info'}`}>
                                                    {reclamation.sujet}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {reclamation.contenu}
                                                </div>
                                            </td>
                                            {isAdmin && (
                                                <td>
                                                    {reclamation.sentiment_local && getSentimentBadge(reclamation.sentiment_local)}
                                                </td>
                                            )}
                                            <td onClick={e => e.stopPropagation()}>
                                                {activeTab === 'sent' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditClick(reclamation)}
                                                            className="btn btn-warning btn-sm mr-2"
                                                            style={{ marginRight: 8 }}
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(reclamation.id)}
                                                            className="btn btn-danger btn-sm"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </>
                                                )}
                                                {activeTab === 'received' && isAdmin && (
                                                    <button
                                                        onClick={() => handleEditClick(reclamation)}
                                                        className="btn btn-warning btn-sm"
                                                    >
                                                        Modifier
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal pour les détails de la réclamation */}
            <Modal
                isOpen={selectedReclamation !== null}
                onClose={() => setSelectedReclamation(null)}
                title="Détails de la réclamation"
            >
                {selectedReclamation && (
                    <div>
                        <div className="mb-3">
                            <h6>Date :</h6>
                            <p>{selectedReclamation.date_creation ? 
                                new Date(selectedReclamation.date_creation).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : '—'
                            }</p>
                        </div>

                        <div className="mb-3">
                            <h6>Type :</h6>
                            <span className={`badge badge-${selectedReclamation.sujet === 'system' ? 'primary' : 'info'}`}>
                                {selectedReclamation.sujet}
                            </span>
                        </div>

                        {selectedReclamation.sujet === 'user' && (
                            <div className="mb-3">
                                <h6>Utilisateur ciblé :</h6>
                                <p><strong>{selectedReclamation.cible?.username || '—'}</strong></p>
                            </div>
                        )}

                        <div className="mb-3">
                            <h6>Auteur :</h6>
                            <p><strong>{selectedReclamation.auteur?.username || '—'}</strong></p>
                        </div>

                        <div className="mb-3">
                            <h6>Contenu :</h6>
                            <div className="p-3 bg-light rounded">
                                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                                    {selectedReclamation.contenu}
                                </pre>
                            </div>
                        </div>

                        {isAdmin && selectedReclamation.sentiment_local && (
                            <div className="mb-3">
                                <h6>Analyse du sentiment :</h6>
                                {getSentimentBadge(selectedReclamation.sentiment_local)}
                            </div>
                        )}

                        {activeTab === 'sent' && (
                            <div className="mt-4">
                                <button
                                    onClick={() => {
                                        handleEditClick(selectedReclamation);
                                        setSelectedReclamation(null);
                                    }}
                                    className="btn btn-warning mr-2"
                                    style={{ marginRight: '10px' }}
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
                                            handleDelete(selectedReclamation.id);
                                            setSelectedReclamation(null);
                                        }
                                    }}
                                    className="btn btn-danger"
                                >
                                    Supprimer
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </PageLayout>
    );
};

export default ReclamationsPage;