import type { ZanrI } from './ZanrI';

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