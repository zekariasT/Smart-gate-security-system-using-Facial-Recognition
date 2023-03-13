import { useLogin, useNotify, Notification } from "react-admin";
import { useEffect, useState } from "react";

import Alert from "@mui/material/Alert";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");

    //Separate state for each password entry
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    //Show input or not
    const [inputVisible, setInputVisible] = useState(false);

    //States for showing alert
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);

    //State for password inputs matching
    const [notSame, setNotSame] = useState(false);

    //React admin login function
    const login = useLogin();

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        //Get username and id stored in localStorage
        const { fullName: username, id } = await JSON.parse(
            localStorage.getItem("auth") || '{fullName: "default"}'
        );

        //Check old password validity
        const testOldPass = await login({ username, password: oldPassword }).catch(
            () => false
        );

        if (testOldPass === false) {
            setShowFailure(true);
            return;
        }
        const data = {
            id: id,
            password: password1,
            passwordConfirm: password2,
            oldPassword: oldPassword,
        };

        const response = await (
            await fetch("/api/changepass", {
                method: "POST",
                body: JSON.stringify(data),
            })
        ).json();

        if (response.success) setShowSuccess(true);
        else setShowFailure(true);
    };

    useEffect(() => {
        if (password1 !== password2) setNotSame(true);
        else setNotSame(false);
    }, [password1, password2]);

    return (
        <div className="changePassBox">
            <div className="flex justify-between items-center">
                <h2 className="changePassHeader font-bold capitalize ">
                    {" "}
                    Change your password{" "}
                </h2>
                {/* Visibility button */}
                <div onClick={() => setInputVisible((prev) => !prev)}>
                    {inputVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type={inputVisible ? "text" : "password"}
                    id="oldPassword"
                    className="input bg-white text-black"
                    placeholder="Old Password"
                    required
                    onChange={(e) => {
                        setOldPassword(e.target.value);
                        setShowSuccess(false);
                        setShowFailure(false);
                    }}
                    value={oldPassword}
                />
                <input
                    type={inputVisible ? "text" : "password"}
                    id="password1"
                    className="input bg-white text-black"
                    placeholder="New Password"
                    required
                    onChange={(e) => {
                        setPassword1(e.target.value);
                    }}
                    value={password1}
                />
                <input
                    type={inputVisible ? "text" : "password"}
                    id="password2"
                    className="input bg-white text-black"
                    placeholder="Type New Password Again"
                    required
                    onChange={(e) => {
                        setPassword2(e.target.value);
                    }}
                    value={password2}
                />
                {notSame && (
                    <label className="changePassHeader text-red-500 text-center input bg-white border-none duration-100">
                        Passwords Do Not Match
                    </label>
                )}
                <button type="submit" className="inputSubmit">
                    Confirm
                </button>
            </form>
            {/* Conditional showing of alerts */}
            {showSuccess && (
                <Alert severity="success" color="success">
                    Successfully changed!
                </Alert>
            )}
            {showFailure && (
                <Alert severity="error" color="error">
                    Failed to change!
                </Alert>
            )}
        </div>
    );
}
