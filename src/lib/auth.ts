import { authStore } from './stores/auth.store';
import { userStore } from './stores/user.store';
import { authRefresh, loginAPI, registerAPI } from './api';
import { jwtDecode } from 'jwt-decode';

export async function login(email: string, password: string, remember: boolean = false) {
    const response = await loginAPI(email, password);
    console.log(response)
    if (response.tokens && response.user) {
        authStore.setTokens(response.tokens, remember);
        userStore.set(response.user, remember);
        return response.user;
    }
    throw new Error('Login failed');
}

export async function register(email: string, password: string, name: string) {
    const response = await registerAPI({ email, password, name });
    if (response.tokens && response.user) {
        authStore.setTokens(response.tokens);
        userStore.set(response.user);
        return response.user;
    }
    throw new Error('Registration failed');
}

export async function logout() {
    authStore.clear();
    userStore.clear();
}

export async function getToken(): Promise<{ accessToken: string } | null> {
    let tokens: any;
    authStore.subscribe(value => tokens = value)();

    if (!tokens) return null;

    // Check if access token is expired
    const decoded = jwtDecode(tokens.accessToken);
    const isExpired = decoded.exp && decoded.exp < Date.now() / 1000;

    if (!isExpired) {
        return { accessToken: tokens.accessToken };
    }

    // Try to refresh the token
    try {
        const response = await authRefresh(tokens.refreshToken);
        if (response.access_token) {
            authStore.updateAccessToken(response.access_token);
            return { accessToken: response.access_token };
        }
    } catch (error) {
        logout();
        throw new Error('Session expired');
    }

    return null;
}
