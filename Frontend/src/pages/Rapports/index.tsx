import { useState, useEffect } from 'react';
import type { Rapport } from '../../types';
import { rapportService } from '../../api/rapport/rapportService';
import { useAuth } from '../../context/AuthContext';
import PageLayout from '../../component/Layout/PageLayout';

const RapportsPage = () => {
    const [rapports, setRapports] = useState<Rapport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [pendingReportId, setPendingReportId] = useState<number | null>(null);
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        type: 'descriptif' as const
    });

    useEffect(() => {
        loadRapports();
    }, []);

    const loadRapports = async () => {
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
        // If creating a new rapport, picture is required. For editing, picture is optional.
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
            } else {
                const created = await rapportService.createRapport(submitFormData);
                // If backend hasn't populated result yet, poll until available
                if (created && !created.result) {
                    setPendingReportId(created.id);
                    setPendingMessage('Génération du rapport en cours — cela peut prendre quelques secondes...');
                    // start polling
                    const start = Date.now();
                    const poll = setInterval(async () => {
                        try {
                            const refreshed = await rapportService.getRapport(created.id);
                            if (refreshed && refreshed.result) {
                                clearInterval(poll);
                                setPendingReportId(null);
                                setPendingMessage(null);
                                await loadRapports();
                            } else if (Date.now() - start > 120000) { // timeout 2 minutes
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
            setEditingId(null);
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

    if (!user) {
        return <div className="alert alert-warning">Veuillez vous connecter pour accéder aux rapports.</div>;
    }

    return (
        <PageLayout title="Gestion des Rapports">

            {/* Formulaire de création */}
            <div className="card mb-4">
                <div className="card-header">
                    <h4>Nouveau Rapport</h4>
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
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Créer le rapport
                        </button>
                    </form>
                </div>
            </div>

            {/* Liste des rapports (grid style) */}
            <div className="card">
                <div className="card-header">
                    <h4>Rapports</h4>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Chargement...</span>
                            </div>
                        </div>
                    ) : rapports.length === 0 ? (
                        <div className="alert alert-info">Aucun rapport disponible.</div>
                    ) : (
                        <div className="row">
                            {rapports.map((rapport) => (
                                <div key={rapport.id} className="col-12 col-sm-6 col-md-4 mb-4">
                                    <div className="card h-100 shadow-sm">
                                        <div style={{ height: 180, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                                            <img src={rapport.picture} alt={rapport.name} style={{ maxHeight: '100%', width: 'auto' }} />
                                        </div>
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title mb-1">{rapport.name}</h5>
                                            <div className="mb-2">
                                                <span className={`badge badge-${rapport.type === 'descriptif' ? 'secondary' : rapport.type === 'analyse' ? 'info' : 'primary'}`}>{rapport.type}</span>
                                            </div>
                                            <p className="card-text text-truncate mb-2" style={{ maxHeight: 48 }}>
                                                {rapport.result ? (<strong>Résultat:</strong>) : 'En attente de génération...'}
                                            </p>
                                            <div className="mt-auto d-flex justify-content-between align-items-center">
                                                <small className="text-muted">{new Date(rapport.created_at).toLocaleDateString()}</small>
                                                <div>
                                                    <button onClick={() => handleEdit(rapport)} className="btn btn-sm btn-outline-secondary me-2">Éditer</button>
                                                    <button onClick={() => handleDelete(rapport.id)} className="btn btn-sm btn-outline-danger">Supprimer</button>
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
            {/* pending overlay */}
            {pendingReportId && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{ background: '#fff', padding: 24, borderRadius: 8, textAlign: 'center', maxWidth: 480 }}>
                        <div className="spinner-border mb-3" role="status">
                            <span className="sr-only">Chargement...</span>
                        </div>
                        <div>{pendingMessage}</div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
};

export default RapportsPage;