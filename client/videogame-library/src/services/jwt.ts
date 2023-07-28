import jwtDecode from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';

export function isTokenExpired(token: string): boolean {
    try {
        const decodedToken: JwtPayload = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp != undefined && decodedToken.exp <= currentTime) {
            return true;
        }
        else return false;
    } catch (error) {
        return true;
    }
}