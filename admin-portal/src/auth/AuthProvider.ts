import { AuthProvider } from "react-admin";
import { PB, loginPB } from "../../database/pocketbase";

const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        const request = new Request("/api/authenticate", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: new Headers({ "Content-Type": "application/json" }),
        });
        try {
            const response = await fetch(request);
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            const auth = await response.json();
            localStorage.setItem("auth", JSON.stringify(auth));
        } catch {
            throw new Error("Network error");
        }

        return { redirectTo: "/" };
    },
    checkAuth: async () => {
        // Required for the authentication to work

        const token = localStorage.getItem("auth");

        if (!token) return Promise.reject();

        const request = new Request("/api/user", {
            method: "POST",
            body: JSON.stringify(token),
            headers: new Headers({ "Content-Type": "application/json" }),
        });

        try {
            const response = await fetch(request);
            if (response.status == 200) return Promise.resolve();
            return Promise.reject();
        } catch {
            return Promise.reject();
        }
    },
    getPermissions: () => {
        // Required for the authentication to work
        return Promise.reject();
    },
    getIdentity: () => {
        const { fullName, id } = JSON.parse(
            localStorage.getItem("auth") || '{fullName: "default"}'
        );

        return Promise.resolve({ fullName, id });
    },
    logout: function (): Promise<string | false | void> {
        localStorage.removeItem("auth");
        return Promise.resolve();
    },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem("auth");
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
};

export default authProvider;
