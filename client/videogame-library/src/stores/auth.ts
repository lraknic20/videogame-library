import { defineStore } from 'pinia';
import { returnDecodedToken, isTokenExpired } from '@/services/jwt';
import { useToast } from "vue-toastification";
const toast = useToast();

interface JwtPayload {
    userType: number;
    userId: number;
}

function checkUserType(userType: number): boolean {
    const token = localStorage.getItem('token');

    if (token) {
        const decodedToken = returnDecodedToken(token) as JwtPayload;
        return decodedToken.userType === userType;
    }

    return false;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedIn: localStorage.getItem('token') !== '',
    }),
    actions: {
        login() {
            this.loggedIn = true;
        },
        isAdmin(): boolean {
            return checkUserType(2);
        },
        isModerator(): boolean {
            return checkUserType(3);
        },
        returnUserType(): number {
            const token = localStorage.getItem('token');

            if (token) {
                const decodedToken = returnDecodedToken(token) as JwtPayload;

                return decodedToken.userType;
            }
            else return 0;
        },
        returnUserId(): number {
            const token = localStorage.getItem('token');

            if (token) {
                const decodedToken = returnDecodedToken(token) as JwtPayload;

                return decodedToken.userId;
            }
            else return 0;
        },
        checkLoggedIn(): boolean {
            const token = localStorage.getItem('token');
            if (token && !isTokenExpired(token)) {
                this.loggedIn = true;
                return true;
            } else {
                this.loggedIn = false;
                return false;
            }
        },
        logout() {
            toast.info('Odjavljeni ste');
            localStorage.removeItem('token');
            this.loggedIn = false;
        },
    },
});