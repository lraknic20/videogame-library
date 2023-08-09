import { defineStore } from 'pinia';
import { returnDecodedToken, isTokenExpired } from '@/services/jwt';
import { useToast } from "vue-toastification";
const toast = useToast();

interface JwtPayload {
    userType: number;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedIn: localStorage.getItem('loggedIn') === 'true',
    }),
    actions: {
        login() {
            this.loggedIn = true;
            localStorage.setItem('loggedIn', 'true');
        },
        isAdmin(): boolean {
            const token = localStorage.getItem('token');

            if (token) {
                const decodedToken = returnDecodedToken(token) as JwtPayload;

                if (decodedToken.userType == 2) {
                    return true;
                }
                else return false;
            }
            else return false;
        },
        isModerator(): boolean {
            const token = localStorage.getItem('token');

            if (token) {
                const decodedToken = returnDecodedToken(token) as JwtPayload;

                if (decodedToken.userType == 3) {
                    return true;
                }
                else return false;
            }
            else return false;
        },
        returnUserType(): number {
            const token = localStorage.getItem('token');

            if (token) {
                const decodedToken = returnDecodedToken(token) as JwtPayload;

                return decodedToken.userType;
            }
            else return 0;
        },
        checkLoggedIn() {
            const token = localStorage.getItem('token');
            if (token && !isTokenExpired(token)) {
                this.loggedIn = true;
            } else {
                this.loggedIn = false;
            }
        },
        logout() {
            toast.info('Odlogirani ste');
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('id');
            localStorage.removeItem('korime');
            localStorage.removeItem('token');
            this.loggedIn = false;
        },
    },
});