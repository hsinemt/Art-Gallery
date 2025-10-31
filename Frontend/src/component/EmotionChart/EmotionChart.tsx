// components/EmotionChart/EmotionChart.tsx
import React from 'react';

interface Emotion {
    name: string;
    intensity: number;
    count: number;
    severity: number;
    keywords?: string[];
}

interface EmotionsData {
    risk_level: string;
    risk_score: number;
    positive_score: number;
    negative_score: number;
    emotions: Emotion[];
}

interface EmotionChartProps {
    emotionsData: EmotionsData;
}

const EmotionChart: React.FC<EmotionChartProps> = ({ emotionsData }) => {
    const emotionEmojis: { [key: string]: string } = {
        'happy': '😊',
        'calm': '😌',
        'sad': '😢',
        'angry': '😠',
        'anxious': '😰',
        'uncomfortable': '😣',
        'disgusted': '🤢',
        'threatened': '😨',
        'confused': '😕',
        'surprised': '😲',
        'guilty': '😔',
        'proud': '😌',
        'love': '❤️',
        'gratitude': '🙏',
        'shame': '😳'
    };

    const emotionColors: { [key: string]: string } = {
        'happy': '#28a745',
        'calm': '#17a2b8',
        'sad': '#6c757d',
        'angry': '#dc3545',
        'anxious': '#ffc107',
        'uncomfortable': '#fd7e14',
        'disgusted': '#e83e8c',
        'threatened': '#dc3545',
        'confused': '#6f42c1',
        'surprised': '#007bff',
        'guilty': '#6c757d',
        'proud': '#20c997',
        'love': '#e83e8c',
        'gratitude': '#28a745',
        'shame': '#dc3545'
    };

    const getRiskColor = (level: string) => {
        const colors: { [key: string]: string } = {
            'HIGH': '#dc3545',
            'MEDIUM': '#ffc107',
            'LOW': '#17a2b8',
            'MINIMAL': '#28a745'
        };
        return colors[level] || '#6c757d';
    };

    if (!emotionsData || !emotionsData.emotions || emotionsData.emotions.length === 0) {
        return (
            <div className="alert alert-info">
                Aucune émotion détectée dans cette réclamation.
            </div>
        );
    }

    return (
        <div className="emotion-chart">
            {/* Risk Overview Card */}
            <div className="card mb-4" style={{ borderLeft: `5px solid ${getRiskColor(emotionsData.risk_level)}` }}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3 text-center">
                            <h6 className="text-muted">Niveau de Risque</h6>
                            <h2 style={{ color: getRiskColor(emotionsData.risk_level) }}>
                                {emotionsData.risk_level}
                            </h2>
                            <div className="progress" style={{ height: '10px' }}>
                                <div 
                                    className="progress-bar" 
                                    style={{ 
                                        width: `${emotionsData.risk_score}%`,
                                        backgroundColor: getRiskColor(emotionsData.risk_level)
                                    }}
                                />
                            </div>
                            <small className="text-muted">{emotionsData.risk_score.toFixed(1)}/100</small>
                        </div>
                        <div className="col-md-4 text-center">
                            <h6 className="text-muted">Score Positif</h6>
                            <h3 className="text-success">{emotionsData.positive_score.toFixed(2)}</h3>
                            <div className="progress" style={{ height: '10px' }}>
                                <div 
                                    className="progress-bar bg-success" 
                                    style={{ width: `${Math.min(emotionsData.positive_score * 10, 100)}%` }}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <h6 className="text-muted">Score Négatif</h6>
                            <h3 className="text-danger">{emotionsData.negative_score.toFixed(2)}</h3>
                            <div className="progress" style={{ height: '10px' }}>
                                <div 
                                    className="progress-bar bg-danger" 
                                    style={{ width: `${Math.min(emotionsData.negative_score * 10, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Emotions Radar/List */}
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">🎭 Émotions Détectées ({emotionsData.emotions.length})</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        {emotionsData.emotions.map((emotion, index) => (
                            <div key={index} className="col-md-6 mb-3">
                                <div 
                                    className="card h-100" 
                                    style={{ 
                                        borderLeft: `4px solid ${emotionColors[emotion.name] || '#6c757d'}`,
                                        boxShadow: emotion.severity > 1 ? '0 4px 8px rgba(220,53,69,0.2)' : 'none'
                                    }}
                                >
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0">
                                                <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>
                                                    {emotionEmojis[emotion.name] || '•'}
                                                </span>
                                                <strong>{emotion.name.toUpperCase()}</strong>
                                            </h6>
                                            <div>
                                                {Array.from({ length: emotion.severity }).map((_, i) => (
                                                    <span key={i} style={{ color: '#dc3545' }}>⚠️</span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="mb-2">
                                            <div className="d-flex justify-content-between mb-1">
                                                <small className="text-muted">Intensité</small>
                                                <small>
                                                    <strong>{emotion.intensity.toFixed(1)}%</strong>
                                                </small>
                                            </div>
                                            <div className="progress" style={{ height: '20px' }}>
                                                <div 
                                                    className="progress-bar" 
                                                    style={{ 
                                                        width: `${emotion.intensity}%`,
                                                        backgroundColor: emotionColors[emotion.name] || '#6c757d'
                                                    }}
                                                >
                                                    {emotion.intensity > 15 && (
                                                        <span style={{ fontSize: '0.8rem' }}>
                                                            {emotion.intensity.toFixed(0)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <small className="text-muted">
                                                Occurrences: <strong>{emotion.count}</strong>
                                            </small>
                                        </div>

                                        {emotion.keywords && emotion.keywords.length > 0 && (
                                            <div>
                                                <small className="text-muted d-block mb-1">Mots-clés:</small>
                                                <div>
                                                    {emotion.keywords.map((keyword, kidx) => (
                                                        <span 
                                                            key={kidx} 
                                                            className="badge badge-secondary mr-1 mb-1"
                                                            style={{ fontSize: '0.7rem' }}
                                                        >
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="card mt-3">
                <div className="card-body">
                    <h6 className="card-title">📊 Statistiques Résumées</h6>
                    <div className="row text-center">
                        <div className="col-md-3">
                            <div className="border rounded p-3">
                                <h5 className="text-primary">{emotionsData.emotions.length}</h5>
                                <small className="text-muted">Émotions Totales</small>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="border rounded p-3">
                                <h5 className="text-success">
                                    {emotionsData.emotions.filter(e => 
                                        ['happy', 'calm', 'proud', 'love', 'gratitude'].includes(e.name)
                                    ).length}
                                </h5>
                                <small className="text-muted">Émotions Positives</small>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="border rounded p-3">
                                <h5 className="text-danger">
                                    {emotionsData.emotions.filter(e => 
                                        ['sad', 'angry', 'anxious', 'uncomfortable', 'disgusted', 'threatened'].includes(e.name)
                                    ).length}
                                </h5>
                                <small className="text-muted">Émotions Négatives</small>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="border rounded p-3">
                                <h5 style={{ color: '#ffc107' }}>
                                    {emotionsData.emotions.filter(e => e.severity > 1).length}
                                </h5>
                                <small className="text-muted">Alertes Sévères</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendation */}
            <div className={`alert alert-${
                emotionsData.risk_level === 'HIGH' ? 'danger' :
                emotionsData.risk_level === 'MEDIUM' ? 'warning' :
                emotionsData.risk_level === 'LOW' ? 'info' : 'success'
            } mt-3`}>
                <strong>💡 Recommandation:</strong>
                {emotionsData.risk_level === 'HIGH' && (
                    <p className="mb-0 mt-2">
                        Cette réclamation contient un contenu significativement négatif avec des émotions fortes. 
                        Une révision immédiate est recommandée pour évaluer la gravité de la situation.
                    </p>
                )}
                {emotionsData.risk_level === 'MEDIUM' && (
                    <p className="mb-0 mt-2">
                        Cette réclamation présente un sentiment négatif modéré. 
                        Un suivi est conseillé pour s'assurer que la situation est prise en compte.
                    </p>
                )}
                {emotionsData.risk_level === 'LOW' && (
                    <p className="mb-0 mt-2">
                        Cette réclamation contient un sentiment légèrement négatif. 
                        Aucune action urgente n'est nécessaire, mais une surveillance peut être utile.
                    </p>
                )}
                {emotionsData.risk_level === 'MINIMAL' && (
                    <p className="mb-0 mt-2">
                        Cette réclamation semble neutre ou positive. 
                        Aucune préoccupation particulière n'a été détectée.
                    </p>
                )}
            </div>
        </div>
    );
};

export default EmotionChart;