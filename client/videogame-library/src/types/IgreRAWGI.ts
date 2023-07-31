export interface IgreRAWGI {
    count: number;
    next: string;
    previous: string;
    results: Array<IgraRAWGI>;
}

export interface IgraRAWGI {
    id: number;
    name: string;
    slug: string,
    genres: Array<ZanrRAWGI>;
    platforms: Array<PlatformeRAWGI>;
    tba: boolean,
    released: string,
    background_image: string,
}

export interface ZanrRAWGI {
    id: number;
    name: string;
    slug: string,
}

export interface PlatformeRAWGI {
    id: number;
    name: string;
    slug: string,
}

export interface IzdavacRAWGI {
    id: number;
    name: string;
    slug: string,
    games_count: number,
    image_background: string,
    description: string
}