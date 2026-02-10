import { Application } from '../foundation/Application';

export interface User {
    id: number;
    email: string;
    [key: string]: any;
}

export class Auth {
    protected app: Application;
    protected user: User | null = null;

    constructor(app: Application) {
        this.app = app;
    }

    public async attempt(credentials: { email: string; password?: string }): Promise<boolean> {
        // Logic for authentication
        console.log(`Attempting login for: ${credentials.email}`);
        return true;
    }

    public login(user: User) {
        this.user = user;
    }

    public logout() {
        this.user = null;
    }

    public check(): boolean {
        return this.user !== null;
    }

    public getUser(): User | null {
        return this.user;
    }
}
