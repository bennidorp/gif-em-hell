import React from "react";
import axios from "./axios.js";
import { Link, Route, BrowserRouter } from "react-router-dom";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            uploaderVisible: false,
        };
    }

    componentDidMount() {
        axios.get("/api/me").then((response) => {
            const { success, user } = response.data;
            if (success) {
                this.setState({ user });
            }
        });
    }

    render() {
        const { user, uploaderVisible } = this.state;

        if (!user) {
            return <div>Loading....</div>;
        }

        return (
            <div className="App">
                {uploaderVisible && (
                    <Uploader
                        closeHandler={() => {
                            this.setState({ uploaderVisible: false });
                        }}
                        uploadDoneHandler={(data) => {
                            console.log("data", data);
                            this.setState({
                                user: {
                                    ...this.state.user,
                                    profile_picture_url: data.pictureUrl,
                                },
                                uploaderVisible: false,
                            });
                        }}
                    />
                )}

                <BrowserRouter>
                    <ul className="NavList">
                        <li>
                            <Link to={"/"}> Your Profile </Link>
                        </li>

                        <li>
                            <Link to={"/search"}> Other Clan Members </Link>
                        </li>
                        <li>
                            <Link to={"/friends"}> Homies </Link>
                        </li>
                    </ul>

                    <Route
                        path="/"
                        exact
                        render={() => {
                            return (
                                <Profile
                                    profile_picture_url={
                                        user.profile_picture_url
                                    }
                                    profilePictureClickHandler={(e) => {
                                        this.setState({
                                            uploaderVisible: true,
                                        });
                                    }}
                                    firstname={user.firstname}
                                    lastname={user.lastname}
                                    bio={user.bio}
                                    saveHandler={(newBio) => {
                                        this.setState({
                                            user: {
                                                ...this.state.user,
                                                bio: newBio,
                                            },
                                            uploaderVisible: false,
                                        });
                                    }}
                                />
                            );
                        }}
                    />
                </BrowserRouter>
            </div>
        );
    }
}
