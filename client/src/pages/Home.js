import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from "react-router-dom";

function getToken() {
    const tokenString = sessionStorage.getItem('token');
    if (tokenString == null || tokenString == "undefined") {
        return null;
    }
    console.log(tokenString);
    return tokenString;
    const userToken = JSON.parse(tokenString);
    return userToken
}


function ActionButton(props) {
    const token = props.token;
    if (token == null || token['success'] == false) {
        return <Link to="/login"
            className="rounded-md bg-blue-600 px-7 py-3 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            Login Portal
        </Link>;
    } else if (token['role'] == "doctor") {
        return <><Link to="/create"
            className="rounded-md bg-blue-600 px-7 py-3 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            Doctor Portal
        </Link>
            <Link to="/#"
                className="ml-5 rounded-md bg-blue-600 px-7 py-3 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => { sessionStorage.clear(); window.location.reload(); }}
            >
                Log out
            </Link>
        </>;
    } else if (token['role'] == "patient") {
        return <><Link to="/patient"
            className="rounded-md bg-blue-600 px-7 py-3 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            Patient Portal
        </Link>
            <Link to="/#"
                className="ml-5 rounded-md bg-blue-600 px-7 py-3 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => { sessionStorage.clear(); window.location.reload(); }}
            >
                Log out
            </Link>
        </>
    }
    return <p>wtf</p>;
}


export default function Home() {

    const token = JSON.parse(getToken());
    return (
        <div className="isolate bg-white">
            <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu  sm:top-[-20rem]">
                <svg
                    className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
                    viewBox="0 0 1155 678"
                >
                    <path
                        fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
                        fillOpacity="5"
                        d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
                    />
                    <defs>
                        <linearGradient
                            id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                            x1="1155.49"
                            x2="-78.208"
                            y1=".177"
                            y2="474.645"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#9089FC" />
                            <stop offset={1} stopColor="#FF80B5" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>


            <div className="px-6 pt-6 lg:px-8">
                <nav className="flex items-center justify-between" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">

                            <img className="h-8" src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600" alt="" />
                        </a>
                        <span className="ml-2 text-2xl font-bold">thrive<span className="text-purple-600">.</span>ai</span>
                    </div>

                </nav>
            </div>
            <main>
                <div className="relative px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                        {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                            <div className="relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                                Announcing our next round of funding.{' '}
                                <a href="#" className="font-semibold text-indigo-600">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    Read more <span aria-hidden="true">&rarr;</span>
                                </a>
                            </div>
                        </div> */}
                        <div className="text-left">
                            <h1 className="text-8xl font-bold tracking-tight text-gray-900 -mb-2">
                                thrive.ai
                            </h1>
                            <p className="mt-6 text-xl font-semibold leading-8 text-gray-600 mb-6">
                                Patient care is more than just a diagnosis.
                            </p>
                            <ActionButton token={token} />
                        </div>
                        <div className="text-center">

                            <div className="mt-10 flex items-center justify-center gap-x-6">


                            </div>
                        </div>

                    </div>
                    <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden sm:top-[calc(100%-30rem)]">
                        <svg
                            className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
                            viewBox="0 0 1155 678"
                        >
                            <path
                                fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                                fillOpacity=".3"
                                d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
                            />
                            <defs>
                                <linearGradient
                                    id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                                    x1="1155.49"
                                    x2="-78.208"
                                    y1=".177"
                                    y2="474.645"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#9089FC" />
                                    <stop offset={1} stopColor="#FF80B5" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </main >
            <footer>
                <p className="text-lg text-gray-600 font-light p-20">
                    Built with ❤️ by Patrick, Kam, and Arul using TailwindUI library.
                </p>

            </footer>
        </div >
    )
}
