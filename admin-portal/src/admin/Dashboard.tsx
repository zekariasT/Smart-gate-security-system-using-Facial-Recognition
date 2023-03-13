// in src/admin/App.jsx
import * as React from "react";
import styles from "./dashboard.module.css";
import {
    Admin,
    Resource,
    ListGuesser,
    ShowGuesser,
    AppBar,
    MenuItemLink,
    UserMenu,
    AppBarProps,
    Layout,
    LayoutProps,
    Logout,
    Link,
    Button,
    LogoutClasses,
    CustomRoutes,
} from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import AuthProvider from "../auth/AuthProvider";
import { CaptureShow, CaptureList } from "../../components/Capture";
import { ContactCreate, ContactList } from "../../components/Contact";
import { DetectionShow, DetectionList } from "../../components/Detection";
import Login from "../../pages/login";
import { CreateButton, ExportButton, TopToolbar } from "react-admin";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import clsx from "clsx";
import { ListItemIcon, ListItemText } from "@mui/material";
import { Route } from "react-router-dom";
import ChangePassword from "../../components/ChangePassword";
import { useRedirect } from "react-admin";

const dataProvider = simpleRestProvider("/api");

const ChangePasswordButton = () => {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const redirect = useRedirect();

    const handleClick = () => redirect("/settings");

    return (
        <Button onClick={handleClick}>
            <div className="text-black bg-black ">
                <SettingsIcon color="inherit" />
            </div>
        </Button>
    );
};

const MyUserMenu = () => (
    <UserMenu>
        <ChangePasswordButton />
        <Logout />
    </UserMenu>
);

const MyAppBar = () => <AppBar userMenu={<MyUserMenu />} />;

const LayoutExtension = (props: JSX.IntrinsicAttributes & LayoutProps) => (
    <Layout {...props} appBar={MyAppBar} />
);

const App = () => {
    return (
        <Admin
            title="My Custom Admin"
            layout={LayoutExtension}
            loginPage={Login}
            dataProvider={dataProvider}
            authProvider={AuthProvider}
            requireAuth
        >
            <Resource name="capture" list={CaptureList} show={CaptureShow} />
            <Resource
                name="detection"
                list={DetectionList}
                show={DetectionShow}
            />
            <Resource
                name="contact"
                list={ContactList}
                show={ShowGuesser}
                create={ContactCreate}
            />
            <CustomRoutes>
                <Route path="/settings" element={<ChangePassword />} />
            </CustomRoutes>
        </Admin>
    );
};

export default App;
