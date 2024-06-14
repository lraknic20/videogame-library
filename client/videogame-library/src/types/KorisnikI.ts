import type { ZanrI } from './ZanrI';

export interface KorisnikI {
    id?: number;
    ime?: string,
    prezime?: string,
    korime?: string,
    email?: string,
    lozinka?: string,
    datum_istek_bloka?: string,
    tip_korisnika_id?: TipKorisnikaI
    zaduzenZanr?: Array<ZanrI>
}

export interface TipKorisnikaI {
    id?: number;
    naziv?: string,
    opis?: string,
}