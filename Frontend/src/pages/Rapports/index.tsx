// pages/Rapports/RapportsPage.tsx (suite)
import { useState, useEffect } from 'react';
import type { Rapport } from '../../types';
import { rapportService } from '../../api/rapport/rapportService';
import { userService } from '../../api/users/userService';
import { useAuth } from '../../context/AuthContext';
import PageLayout from '../../component/Layout/PageLayout';
import Modal from '../../component/Modal/Modal';

const RapportsPage = () => {
    const [rapports, setRapports] = useState<Rapport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [pendingReportId, setPendingReportId] = useState<number | null>(null);
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);
    const [selectedRapport, setSelectedRapport] = useState<Rapport | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const { user, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        type: 'descriptif' as const
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
        if (!authLoading && user) {
            loadRapports();
        }
    }, [authLoading, user]);

    const loadRapports = async () => {
        setLoading(true);
        try {
            const data = await rapportService.getAllRapports();
            setRapports(data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des rapports');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId && !selectedFile) {
            setError('Veuillez sélectionner une image');
            return;
        }

        const submitFormData = new FormData();
        submitFormData.append('name', formData.name);
        submitFormData.append('type', formData.type);
        if (selectedFile) {
            submitFormData.append('picture', selectedFile);
        }

        try {
            if (editingId) {
                await rapportService.updateRapport(editingId, submitFormData);
                setEditingId(null);
            } else {
                const created = await rapportService.createRapport(submitFormData);
                if (created && !created.result) {
                    setPendingReportId(created.id);
                    setPendingMessage('Génération du rapport en cours — cela peut prendre quelques secondes...');
                    const start = Date.now();
                    const poll = setInterval(async () => {
                        try {
                            const refreshed = await rapportService.getRapport(created.id);
                            if (refreshed && refreshed.result) {
                                clearInterval(poll);
                                setPendingReportId(null);
                                setPendingMessage(null);
                                await loadRapports();
                            } else if (Date.now() - start > 120000) {
                                clearInterval(poll);
                                setPendingMessage('La génération prend trop de temps. Le rapport restera en attente.');
                            }
                        } catch (e) {
                            console.error('Polling error', e);
                        }
                    }, 1500);
                }
            }
            setFormData({ name: '', type: 'descriptif' });
            setSelectedFile(null);
            await loadRapports();
            setError(null);
        } catch (err) {
            setError('Erreur lors de la création du rapport');
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
            return;
        }

        try {
            await rapportService.deleteRapport(id);
            await loadRapports();
            setError(null);
        } catch (err) {
            setError('Erreur lors de la suppression du rapport');
            console.error(err);
        }
    };

    const handleEdit = (rapport: Rapport) => {
        setEditingId(rapport.id);
        setFormData({ name: rapport.name, type: rapport.type as any });
        setSelectedFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', type: 'descriptif' });
        setSelectedFile(null);
    };

    if (authLoading) {
        return (
            <PageLayout title="Gestion des Rapports">
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
            <PageLayout title="Gestion des Rapports">
                <div className="alert alert-warning">
                    Veuillez vous connecter pour accéder aux rapports.
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Gestion des Rapports">
            <div className="card mb-4">
                <div className="card-header">
                    <h4>{editingId ? 'Modifier le Rapport' : 'Nouveau Rapport'}</h4>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nom du rapport</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Type de rapport</label>
                            <select
                                className="form-control"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                required
                            >
                                <option value="descriptif">Descriptif</option>
                                <option value="analyse">Analyse</option>
                                <option value="evaluation">Évaluation</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Image</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                required={!editingId}
                            />
                            {editingId && (
                                <small className="form-text text-muted">
                                    Laissez vide pour conserver l'image actuelle
                                </small>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary mr-2">
                            {editingId ? 'Mettre à jour' : 'Créer le rapport'}
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={handleCancelEdit}
                            >
                                Annuler
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4>
                        {isAdmin ? 'Tous les Rapports' : 'Mes Rapports'}
                        {!loading && ` (${rapports.length})`}
                    </h4>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Chargement...</span>
                            </div>
                        </div>
                    ) : rapports.length === 0 ? (
                        <div className="alert alert-info">
                            {isAdmin ? 'Aucun rapport disponible dans le système.' : 'Vous n\'avez créé aucun rapport pour le moment.'}
                        </div>
                    ) : (
                        <div className="row">
                            {rapports.map((rapport) => (
                                <div key={rapport.id} className="col-12 col-sm-6 col-md-4 mb-4">
                                    <div className="card h-100 shadow-sm">
                                        <div 
                                            style={{ 
                                                height: 180, 
                                                overflow: 'hidden', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                background: '#f8f9fa', 
                                                cursor: 'pointer' 
                                            }}
                                            onClick={() => setSelectedRapport(rapport)}
                                        >
                                            <img 
                                                src={rapport.picture} 
                                                alt={rapport.name} 
                                                style={{ maxHeight: '100%', width: 'auto' }} 
                                            />
                                        </div>
                                        <div className="card-body d-flex flex-column">
                                            <h5 
                                                className="card-title mb-1" 
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setSelectedRapport(rapport)}
                                            >
                                                {rapport.name}
                                            </h5>
                                            <div className="mb-2">
                                                <span className={`badge badge-${
                                                    rapport.type === 'descriptif' ? 'secondary' : 
                                                    rapport.type === 'analyse' ? 'info' : 
                                                    'primary'
                                                }`}>
                                                    {rapport.type}
                                                </span>
                                            </div>
                                            {isAdmin && rapport.user && (
                                                <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
                                                    <strong>Par:</strong> {rapport.user.username}
                                                </p>
                                            )}
                                            <p className="card-text mb-2" style={{ fontSize: '0.875rem' }}>
                                                {rapport.result ? (
                                                    <span className="text-success">✓ Rapport généré</span>
                                                ) : (
                                                    <span className="text-warning">⏳ En attente...</span>
                                                )}
                                            </p>
                                            <div className="mt-auto d-flex justify-content-between align-items-center">
                                                <small className="text-muted">
                                                    {new Date(rapport.created_at).toLocaleDateString('fr-FR')}
                                                </small>
                                                <div>
                                                    <button 
                                                        onClick={() => handleEdit(rapport)} 
                                                        className="btn btn-sm btn-outline-secondary"
                                                        style={{ marginRight: '8px' }}
                                                    >
                                                        Éditer
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(rapport.id)} 
                                                        className="btn btn-sm btn-outline-danger"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {rapport.id === pendingReportId && (
                                            <div className="card-footer text-center">
                                                <div className="spinner-border spinner-border-sm" role="status"></div>
                                                &nbsp;Génération en cours...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {pendingReportId && (
                <div style={{
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0,
                    background: 'rgba(0,0,0,0.4)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 9999
                }}>
                    <div style={{ 
                        background: '#fff', 
                        padding: 24, 
                        borderRadius: 8, 
                        textAlign: 'center', 
                        maxWidth: 480 
                    }}>
                        <div className="spinner-border mb-3" role="status">
                            <span className="sr-only">Chargement...</span>
                        </div>
                        <div>{pendingMessage}</div>
                    </div>
                </div>
            )}

            <Modal
                isOpen={selectedRapport !== null}
                onClose={() => setSelectedRapport(null)}
                title={selectedRapport?.name || "Détails du rapport"}
            >
                {selectedRapport && (
                    <div>
                        <div className="text-center mb-4">
                            <img 
                                src={selectedRapport.picture} 
                                alt={selectedRapport.name} 
                                style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} 
                            />
                        </div>

                        {isAdmin && selectedRapport.user && (
                            <div className="mb-3">
                                <h6>Créé par :</h6>
                                <p>
                                    <strong>{selectedRapport.user.username}</strong>
                                    {selectedRapport.user.email && ` (${selectedRapport.user.email})`}
                                </p>
                            </div>
                        )}

                        <div className="mb-3">
                            <h6>Type :</h6>
                            <span className={`badge badge-${
                                selectedRapport.type === 'descriptif' ? 'secondary' : 
                                selectedRapport.type === 'analyse' ? 'info' : 
                                'primary'
                            }`}>
                                {selectedRapport.type}
                            </span>
                        </div>

                        <div className="mb-3">
                            <h6>Date de création :</h6>
                            <p>{new Date(selectedRapport.created_at).toLocaleDateString('fr-FR', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>

                        <div className="mb-3">
                            <h6>Résultat :</h6>
                            {selectedRapport.result ? (
                                <div className="p-3 bg-light rounded">
                                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                                        {selectedRapport.result}
                                    </pre>
                                </div>
                            ) : (
                                <div className="alert alert-warning">
                                    En attente de génération...
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    handleEdit(selectedRapport);
                                    setSelectedRapport(null);
                                }}
                                className="btn btn-warning mr-2"
                                style={{ marginRight: '10px' }}
                            >
                                Modifier
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
                                        handleDelete(selectedRapport.id);
                                        setSelectedRapport(null);
                                    }
                                }}
                                className="btn btn-danger"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </PageLayout>
    );
};

export default RapportsPage;