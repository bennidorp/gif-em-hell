import React from "react";
//import Register from "./Register.js";
//import Login from "./Login.js";
//import PasswordReset from "./PasswordReset.js";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Gif 'em hell</h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset-password" component={PasswordReset} />
                </div>
            </HashRouter>
        </div>
    );
}
