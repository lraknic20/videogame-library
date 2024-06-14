export interface IgreRAWGI {
    count: number;
    next: string;
    previous: string;
    results: Array<IgraRAWGI>;
}

export interface IgraRAWGI {
    id: number;
    name: string;
    slug: string;
    description: string;
    genres: Array<genres>;
    platforms: Array<platforms>;
    publishers: Array<publishers>;
    tba: boolean;
    released: string;
    background_image: string;
    website: string;
    metacritic: number;
    minimum_requirements: string;
    recommended_requirements: string;
}

export interface genres {
    id: number;
    name: string;
    slug: string;
    games_count: number;
}

export interface platforms {
    platform: platform;
    requirements?: requirements;
}

export interface platform {
    id: number;
    name: string;
    slug: string;
    games_count: number;
}

export interface requirements {
    minimum: string;
    recommended: string;
}

export interface publishers {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
    description: string;
}