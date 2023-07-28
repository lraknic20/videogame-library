import { returnDecodedToken, isTokenExpired } from '@/services/jwt';

interface JwtPayload {
    userType: number;
}

export function isLoggedIn(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
        const tokenValid = !isTokenExpired(token);
        if (tokenValid) {
            return true;
        }
        else return false;
    }
    else return false;
}

export function isAdmin(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
        const decodedToken = returnDecodedToken(token) as JwtPayload;

        if (decodedToken.userType == 2) {
            return true;
        }
        else return false;
    }
    else return false;
}

export function isModerator(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
        const decodedToken = returnDecodedToken(token) as JwtPayload;

        if (decodedToken.userType == 3) {
            return true;
        }
        else return false;
    }
    else return false;
}

export function returnUserType(): number {
    const token = localStorage.getItem('token');

    if (token) {
        const decodedToken = returnDecodedToken(token) as JwtPayload;

        return decodedToken.userType;
    }
    else return 0;
}