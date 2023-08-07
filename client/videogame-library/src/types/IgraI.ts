import type { ZanrI } from './ZanrI';
import type { PlatformaI } from './PlatformaI';
import type { IzdavaciI } from './IzdavaciI';

export interface IgraI {
    id: number;
    naziv: string;
    kratki_naziv: string;
    opis?: string;
    slika: string;
    objavljeno?: boolean;
    datum_izlaska?: string;
    stranica?: string;
    metacritic?: number;
    minimalni_zahtjevi?: string;
    preporuceni_zahtjevi?: string;

    zanrovi?: Array<ZanrI>;
    platforme?: Array<PlatformaI>;
    izdavaci?: Array<IzdavaciI>;
}