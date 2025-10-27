

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