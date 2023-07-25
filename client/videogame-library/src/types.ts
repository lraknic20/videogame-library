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

export interface IgraI {
    id: number;
    naziv: string;
    kratki_naziv: string;
    opis: string;
    slika: string;
    objavljeno: boolean;
    datum_izlaska: string;
    stranica: string;
    metacritic: string;
    minimalni_zahtjevi: string;
    preporuceni_zahtjevi: string;

    zanrovi?: Array<ZanrI>;
}

export interface ZanrI {
    id: number;
    naziv: string;
    br_igara: number;
}