

export interface User {
    id: number;
    username: string;
    is_superuser?: boolean;
    is_staff?: boolean;
}

export interface Rapport {
    id: number;
    user: User;
    name: string;
    type: 'descriptif' | 'analyse' | 'evaluation';
    picture: string;
    result?: string;
    created_at: string;
}

export interface Reclamation {
    id: number;
    auteur: User;
    cible?: User;
    sujet: 'system' | 'user';
    contenu: string;
    sentiment_local?: string;
    emotions_local?: Record<string, number>;
    date_creation: string;
}

export interface PhotoWallItem {
    id: number;
    src: string;
    link: string;
    backgroundPosition?: string;
}

export interface NavLink {
    label: string;
    href: string;
    isActive?: boolean;
}

export interface DropdownMenu {
    label: string;
    items: NavLink[];
    submenus?: DropdownMenu[];
}

export interface SocialLink {
    platform: string;
    url: string;
    icon: string;
    title: string;
}