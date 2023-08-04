import type { IgraI } from './IgraI';

export interface RecenzijaI {
    id: number;
    ocjena: number;
    komentar: string;
    datum: string;
    obrisano: boolean;
    korime: string;
    korisnikId: number;
    igra: IgraI;
    datum_istek_bloka: string;
}