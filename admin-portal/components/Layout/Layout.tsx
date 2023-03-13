import React from "react-dom";
import Head from "next/head";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: any }) {
    return (
        <>
            <Head>
                <title> Admin Portal </title>
            </Head>
            <div className={styles.main}>{children}</div>
        </>
    );
}
