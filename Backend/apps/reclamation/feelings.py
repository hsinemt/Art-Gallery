import re
from collections import Counter

def analyze_feelings(text):
    """
    Enhanced sentiment analyzer with stronger negative emotion detection
    Focuses on detecting problematic content, harmful language, and negative sentiments
    """
    # Expanded emotions with more negative keywords (English + French)
    emotions = {
        'happy': ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 
                  'good', 'pleased', 'delighted', 'fantastic', 'excellent', 'cheerful',
                  'heureux', 'joie', 'excité', 'formidable', 'merveilleux', 
                  'content', 'ravie', 'fantastique', 'excellent', 'joyeux', 'satisfait'],
        
        'calm': ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'comfortable',
                 'calme', 'paisible', 'détendu', 'serein', 'tranquille', 'confortable'],
        
        'sad': ['sad', 'depressed', 'unhappy', 'miserable', 'down', 'heartbroken', 
                'upset', 'disappointed', 'hurt', 'cry', 'crying', 'tears', 'sorrow',
                'grief', 'mourning', 'devastated', 'hopeless', 'despair',
                'triste', 'déprimé', 'malheureux', 'miserable', 'découragé', 'coeur brisé',
                'attristé', 'déçu', 'blessé', 'pleurer', 'larmes', 'chagrin', 'désespéré'],
        
        'angry': ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated', 
                  'rage', 'hate', 'outraged', 'disgusted', 'hostile', 'aggressive',
                  'violent', 'enraged', 'livid', 'infuriated', 'resentful', 'bitter',
                  'pissed', 'damn', 'hell', 'shit', 'fuck', 'bloody', 'stupid', 'idiot',
                  'en colère', 'furieux', 'agacé', 'frustré', 'irrité', 'haine', 
                  'outré', 'dégoûté', 'hostile', 'agressif', 'violent', 'enragé',
                  'merde', 'putain', 'con', 'connard', 'imbécile', 'stupide'],
        
        'anxious': ['anxious', 'worried', 'nervous', 'stressed', 'scared', 'fear', 
                    'afraid', 'panic', 'tense', 'terrified', 'frightened', 'alarmed',
                    'dread', 'paranoid', 'threatened', 'insecure', 'vulnerable',
                    'anxieux', 'inquiet', 'nerveux', 'stressé', 'effrayé', 'peur', 
                    'paniqué', 'tendu', 'terrifié', 'menacé', 'vulnérable'],
        
        'uncomfortable': ['uncomfortable', 'uneasy', 'disturbed', 'bothered', 'troubled', 
                          'awkward', 'inappropriate', 'offensive', 'violated', 'concern',
                          'disturbing', 'unsettling', 'concerning', 'worrying', 'alarming',
                          'creepy', 'weird', 'strange', 'suspicious', 'wrong',
                          'mal à l\'aise', 'gêné', 'perturbé', 'ennuyé', 'inquiet', 
                          'inapproprié', 'offensant', 'violé', 'dérangeant', 'bizarre', 'suspect'],
        
        'disgusted': ['disgusted', 'revolted', 'repulsed', 'sickened', 'nauseated',
                      'appalled', 'horrified', 'gross', 'vile', 'repugnant', 'abhorrent',
                      'dégoûté', 'révolté', 'répugné', 'écœuré', 'horrible', 'ignoble'],
        
        'threatened': ['threatened', 'danger', 'unsafe', 'risk', 'harm', 'abuse',
                       'harassment', 'bully', 'attack', 'assault', 'violence',
                       'menacé', 'danger', 'dangereux', 'risque', 'préjudice', 
                       'harcèlement', 'violence', 'agression'],
        
        'confused': ['confused', 'lost', 'unsure', 'uncertain', 'puzzled', 'perplexed',
                     'bewildered', 'disoriented',
                     'confus', 'perdu', 'incertain', 'dérouté', 'perplexe', 'hésitant'],
        
        'surprised': ['surprised', 'shocked', 'amazed', 'astonished', 'stunned',
                      'étonné', 'surpris', 'choqué', 'stupéfait'],
        'guilty': ['guilty', 'remorse', 'repentant', 'ashamed',
                   'coupable', 'remords', 'repenti', 'honteux'],
        'proud': ['proud', 'accomplished', 'fier', 'fière', 'accompli'],
        'love': ['love', 'affection', 'adore', 'cherish',
                 'amour', 'affection', 'adorer', 'chérir'],
        'gratitude': ['grateful', 'thankful', 'appreciate', 'thanks',
                      'reconnaissant', 'merci', 'remerciements', 'gratitude'],
        'shame': ['shame', 'embarrassed', 'humiliated', 'mortified',
                  'honte', 'gêné', 'humiliation', 'embarrassant']
    }
    
    # Problematic content patterns (heavily weighted)
    problematic_patterns = {
        'harassment': [
            r'harass(ment|ing|ed)?',
            r'bully(ing)?',
            r'stalk(ing|er)?',
            r'threaten(ing|ed)?',
            r'intimidat(e|ing|ion)',
            r'harcèlement',
            r'harceler',
            r'intimider',
            r'menacer'
        ],
        'hate_speech': [
            r'hate\s+(speech|crime)',
            r'racial slur',
            r'discriminat(e|ion|ory)',
            r'racist',
            r'sexist',
            r'homophobic',
            r'bigot(ry)?',
            r'discours de haine',
            r'discrimination',
            r'raciste',
            r'sexiste'
        ],
        'violence': [
            r'violen(ce|t)',
            r'abu(se|sive)',
            r'assault',
            r'attack(ing)?',
            r'harm(ful|ing)?',
            r'hurt(ing)?',
            r'injur(e|y|ing)',
            r'agression',
            r'violence',
            r'blesser'
        ],
        'sexual_content': [
            r'sexual',
            r'explicit',
            r'pornograph(y|ic)',
            r'nude',
            r'nsfw',
            r'sexuel',
            r'explicite',
            r'pornographique'
        ],
        'reporting': [
            r'report(ing)?',
            r'violat(e|es|ing|ion)',
            r'guidelines?',
            r'policy',
            r'terms of service',
            r'complaint',
            r'flag(ging)?',
            r'signaler',
            r'violation',
            r'règlement',
            r'plainte'
        ],
        'offensive': [
            r'offens(ive|e)',
            r'inappropriat(e|ed?)',
            r'unacceptable',
            r'disgust(ing)?',
            r'horrible',
            r'terrible',
            r'awful',
            r'gross',
            r'offensant',
            r'inapproprié',
            r'inacceptable',
            r'horrible'
        ]
    }
    
    # Strong negative sentiment indicators
    strong_negative_phrases = [
        r'makes? me (feel )?uncomfortable',
        r'should (not|never) be',
        r'need(s)? to be removed',
        r'take (immediate )?action',
        r'this is (completely )?(unacceptable|wrong|inappropriate)',
        r'violates',
        r'against (the )?rules',
        r'not (ok|okay|acceptable)',
        r'seriously concerned',
        r'deeply (troubled|disturbed|concerned)',
        r'me rend mal à l\'aise',
        r'devrait être supprimé',
        r'prendre des mesures',
        r'c\'est inacceptable'
    ]
    
    text_lower = text.lower()
    words = re.findall(r'\b\w+\b', text_lower)
    
    detected_emotions = {}
    emotion_keywords_found = {}
    severity_multiplier = {}
    
    # Detect emotions from keywords (base weight: 1)
    for emotion, keywords in emotions.items():
        matches = [word for word in keywords if word in text_lower]
        if matches:
            detected_emotions[emotion] = len(matches)
            emotion_keywords_found[emotion] = matches
            severity_multiplier[emotion] = 1
    
    # Check problematic patterns (weight: 5x for negative content)
    for category, patterns in problematic_patterns.items():
        for pattern in patterns:
            matches = re.findall(pattern, text_lower)
            if matches:
                # Map to appropriate emotion
                emotion_map = {
                    'harassment': 'threatened',
                    'hate_speech': 'uncomfortable',
                    'violence': 'threatened',
                    'sexual_content': 'uncomfortable',
                    'reporting': 'uncomfortable',
                    'offensive': 'disgusted'
                }
                emotion = emotion_map.get(category, 'uncomfortable')
                detected_emotions[emotion] = detected_emotions.get(emotion, 0) + 5
                if emotion not in emotion_keywords_found:
                    emotion_keywords_found[emotion] = []
                emotion_keywords_found[emotion].append(f"[{category}]")
                severity_multiplier[emotion] = 5
    
    # Check strong negative phrases (weight: 7x)
    for pattern in strong_negative_phrases:
        if re.search(pattern, text_lower):
            detected_emotions['uncomfortable'] = detected_emotions.get('uncomfortable', 0) + 7
            if 'uncomfortable' not in emotion_keywords_found:
                emotion_keywords_found['uncomfortable'] = []
            emotion_keywords_found['uncomfortable'].append(f"[strong negative phrase]")
            severity_multiplier['uncomfortable'] = 7
    
    # Determine sentiment polarity with BIAS toward negative
    positive_emotions = ['happy', 'calm', 'proud', 'love', 'gratitude']
    negative_emotions = ['sad', 'angry', 'anxious', 'uncomfortable', 'confused', 
                         'shame', 'guilty', 'disgusted', 'threatened']
    
    # Apply multipliers for weighted scoring
    positive_score = sum(detected_emotions.get(e, 0) for e in positive_emotions)
    negative_score = sum(detected_emotions.get(e, 0) for e in negative_emotions)
    
    # BIAS: Negative emotions need 2x less intensity to trigger negative sentiment
    negative_score = negative_score * 1.5
    
    if negative_score > positive_score + 2:  # Threshold favors negative detection
        sentiment = 'Negative'
    elif positive_score > negative_score:
        sentiment = 'Positive'
    else:
        sentiment = 'Neutral/Negative'  # Changed from just 'Neutral'
    
    # Calculate risk level
    risk_score = negative_score / max(len(words), 1) * 100
    if risk_score > 50:
        risk_level = 'HIGH'
    elif risk_score > 20:
        risk_level = 'MEDIUM'
    elif risk_score > 5:
        risk_level = 'LOW'
    else:
        risk_level = 'MINIMAL'
    
    # Calculate intensities
    emotion_intensities = {}
    if detected_emotions:
        max_count = max(detected_emotions.values())
        for emotion, count in detected_emotions.items():
            emotion_intensities[emotion] = {
                'count': count,
                'intensity': round((count / max_count) * 100, 2),
                'keywords': emotion_keywords_found[emotion],
                'severity': severity_multiplier.get(emotion, 1)
            }
    
    # Detect language
    french_keywords = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'le', 'la', 'les']
    lang = 'French' if any(k in text_lower for k in french_keywords) else 'English'
    
    analysis = {
        'text': text,
        'word_count': len(words),
        'sentiment': sentiment,
        'risk_level': risk_level,
        'risk_score': round(risk_score, 2),
        'emotions_detected': len(detected_emotions),
        'emotions': emotion_intensities,
        'positive_score': round(positive_score, 2),
        'negative_score': round(negative_score, 2),
        'language': lang
    }
    
    return analysis


def print_analysis(analysis):
    """
    Enhanced pretty print with risk assessment
    """
    print("\n" + "="*70)
    print("ENHANCED SENTIMENT ANALYSIS - NEGATIVE CONTENT DETECTION")
    print("="*70)
    
    print(f"\nOriginal Text: {analysis['text'][:150]}{'...' if len(analysis['text']) > 150 else ''}")
    print(f"Word Count: {analysis['word_count']}")
    print(f"Detected Language: {analysis['language']}")
    
    # Risk assessment with color coding (text representation)
    risk_color = {
        'HIGH': '🔴',
        'MEDIUM': '🟠',
        'LOW': '🟡',
        'MINIMAL': '🟢'
    }
    
    print(f"\n{risk_color.get(analysis['risk_level'], '⚪')} RISK LEVEL: {analysis['risk_level']}")
    print(f"Risk Score: {analysis['risk_score']}/100")
    print(f"Overall Sentiment: {analysis['sentiment']}")
    print(f"Positive Score: {analysis['positive_score']} | Negative Score: {analysis['negative_score']}")
    print(f"Emotions Detected: {analysis['emotions_detected']}")
    
    if analysis['emotions']:
        print("\n" + "-"*70)
        print("DETECTED EMOTIONS (sorted by intensity):")
        print("-"*70)
        
        sorted_emotions = sorted(
            analysis['emotions'].items(), 
            key=lambda x: x[1]['intensity'], 
            reverse=True
        )
        
        for emotion, data in sorted_emotions:
            severity_indicator = '⚠️ ' * data['severity'] if data['severity'] > 1 else ''
            print(f"\n{severity_indicator}{emotion.upper()}:")
            print(f"  Intensity: {data['intensity']}%")
            print(f"  Occurrences: {data['count']} (severity multiplier: {data['severity']}x)")
            print(f"  Keywords/context: {', '.join(data['keywords'][:8])}")
            
            bar_length = int(data['intensity'] / 5)
            bar = "█" * bar_length
            print(f"  [{bar}{' ' * (20 - bar_length)}]")
    else:
        print("\nNo strong emotions detected.")
    
    # Recommendation
    print("\n" + "-"*70)
    print("RECOMMENDATION:")
    if analysis['risk_level'] == 'HIGH':
        print("  ⚠️  This content contains significant negative sentiment and should be reviewed.")
    elif analysis['risk_level'] == 'MEDIUM':
        print("  ⚡ This content shows moderate negative sentiment. Monitor if needed.")
    elif analysis['risk_level'] == 'LOW':
        print("  ℹ️  This content has minimal negative sentiment.")
    else:
        print("  ✅ This content appears neutral or positive.")
    
    print("\n" + "="*70 + "\n")


if __name__ == "__main__":
    # Test examples
    test_texts = [
        """I would like to report an image on your website that contains an inappropriate or offensive message. It makes me feel uncomfortable and I believe it violates your community guidelines. Please review and take the necessary action.""",
        
        """This is absolutely disgusting content! I'm horrified and deeply disturbed by what I saw. This kind of harassment and hate speech should never be allowed. Remove it immediately!""",
        
        """Thank you so much for your wonderful service! I'm really happy with everything.""",
        
        """Je voudrais signaler un contenu inapproprié qui me rend très mal à l'aise. C'est inacceptable et devrait être supprimé immédiatement."""
    ]
    
    for i, text in enumerate(test_texts, 1):
        print(f"\n{'#'*70}")
        print(f"TEST CASE {i}")
        print(f"{'#'*70}")
        analysis = analyze_feelings(text)
        print_analysis(analysis)