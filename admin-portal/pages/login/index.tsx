import Layout from "../../components/Layout/Layout";
import styles from "./login.module.css";
import { useLogin, useNotify, Notification } from "react-admin";
import { useState } from "react";
export default function Index() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        login({ username, password }).catch(() =>
            notify("Invalid email or password")
        );
    };

    return (
        <Layout>
            <div className={styles.loginBox}>
                <h2 className={styles.loginHeader}> Admin Portal </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className={styles.input}
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        className={styles.input}
                        placeholder="Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className={styles.inputSubmit}>
                        Login
                    </button>
                </form>
            </div>
        </Layout>
    );
}
