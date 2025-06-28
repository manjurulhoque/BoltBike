export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
}

import { APIResponse } from './api';

export interface AuthTokenData {
    access: string;
    refresh: string;
}

export interface AuthResponse extends APIResponse<AuthTokenData> {}

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    profile_photo?: string;
    created_at: string;
    updated_at: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirm {
    new_password: string;
    new_password_confirm: string;
}
