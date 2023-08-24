import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from "react-router-dom";




export default function Login() {

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [redirectTarget, setRedirectTarget] = useState("");
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault();

        const token = await loginUser({
            username,
            password
        }).then(data => console.log("noice: " + data));




        return token;


    }

    async function loginUser(user) {


        console.log(user);

        axios.post('/login', { user })
            .then(res => {
                console.log("here's what i got:")
                console.log(res);
                console.log(res.data);

                if (res.data.success) {
                    sessionStorage.setItem('token', JSON.stringify(res.data));
                    window.location.reload();

                }
                return res.data
            })


    }
    // if (redirectTarget != "") {
    //     return <Navigate to={redirectTarget} />
    // }

    return (
        <>
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">

                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>

                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <div className="mt-1">
                                    <input
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        onChange={e => setUserName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>


                    </div>
                </div>
            </div>
        </>
    )
}
