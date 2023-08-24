import { Fragment, useCallback, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ScanCard from '../components/ScanCard'
import PatientView from '../components/PatientViewer/PatientView'
import PatientViewer from '../components/PatientViewer/PatientViewer'
import axios from 'axios';
import { PaperClipIcon } from '@heroicons/react/20/solid'
import lungs1 from '../components/lungs1.jpg'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}





export default function DoctorPortal(token) {
    const [patientData, setPatientData] = useState();
    // const [selectedData, setData] = useState();

    const fetchData = useCallback(async () => {
        const t = sessionStorage.getItem('token')

        axios.post('/get_patients', JSON.parse(t))
            .then(res => {
                console.log("here's what i got:")
                console.log(res);
                console.log(res.data);

                setPatientData(res.data);
                console.log(patientData);

                return res.data
            })


    }, [])

    useEffect(() => {
        fetchData()
            // make sure to catch any error
            .catch(console.error);
    }, [])


    let selectedData = {
        "id": "1",
        "doctor": "6",
        "note": "Hi, _, based on your respiratory test results and CT scan, it appears you have been infected by the omicron variant of the COVID-19 virus. Your next steps should include quarantining for a full 14 days and symptom management with over the counter medicine like Ibuprofen. Best, __",
        "info": {
            "age": 69,
            "name": "Billy",
            "sex": "Male"
        },
        "hasCovid": true,
        "scans": {
            "original": "./database/patient1/Patient1.png",
            "cam": "./database/patient1/Patient1_CAM.png"
        }
    };

    return (
        patientData ?
            <>
                <div className="min-h-full">


                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-black">Doctor Dashboard</h1>
                        </div>
                    </header>
                    <main>



                        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                            <div className="flex gap-4">
                                <div className="form-control">
                                    <div className="input-group">
                                        <input type="text" placeholder="Search Patients..." className="input input-bordered" />
                                        <button className="btn btn-square">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <button className="btn btn-outline btn-primary">New Patient</button>



                            </div>

                            <div className="px-4 py-6 sm:px-0">
                                <div className="h-96 rounded-lg border-2 border-solid border-gray-200">
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">

                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Age</th>
                                                    <th>Sex</th>
                                                    <th>COVID</th>
                                                    <th>View Scan</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {console.log(patientData)}

                                                {(patientData.map((item, index) => {

                                                    return <tr key={index}>
                                                        <td>{item["info"]["name"]}</td>
                                                        <td>{item['info']['age']}</td>
                                                        <td>{item['info']['sex']}</td>
                                                        <td>{item['info']['hasCovid'] ? "Positive" : "Negative"}</td>
                                                        <td><div className="btn-link" > View</div></td>
                                                    </tr>
                                                }))}


                                            </tbody>
                                        </table>
                                    </div>

                                </div>

                            </div>
                            {/* /End replace */}
                            <p></p>
                            <div className="px-4 sm:px-0">
                                <div className="rounded-lg border-2 border-solid border-gray-200">
                                    <div >


                                        <header className="bg-white shadow">
                                            <div className="flex mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                                                <h1 className="text-3xl font-bold tracking-tight text-black">Patient {selectedData.info.name}</h1>
                                                <button className="btn btn-outline btn-primary mx-10">Edit</button>
                                            </div>
                                        </header>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                            {/* information */}
                                            <div className="sm:col-span-1 py-5 px-4 sm:px-6">
                                                <div>
                                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">For medical purposes.</p>
                                                </div>
                                                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                                        <div className="sm:col-span-1">
                                                            <dt className="text-sm font-medium text-gray-500">Age</dt>
                                                            <dd className="mt-1 text-sm text-gray-900">{selectedData.info.age}</dd>
                                                        </div>
                                                        <div className="sm:col-span-1">
                                                            <dt className="text-sm font-medium text-gray-500">Sex</dt>
                                                            <dd className="mt-1 text-sm text-gray-900">{selectedData.info.sex}</dd>
                                                        </div>
                                                        <div className="sm:col-span-1">
                                                            <dt className="text-sm font-medium text-gray-500">COVID Test</dt>
                                                            <dd className="mt-1 text-sm text-gray-900">{selectedData.hasCovid ? "Positive" : "Negative"}</dd>
                                                        </div>
                                                        <div className="sm:col-span-1">
                                                            <dt className="text-sm font-medium text-gray-500">ID</dt>
                                                            <dd className="mt-1 text-sm text-gray-900">{selectedData.id}</dd>
                                                        </div>



                                                        <div className="sm:col-span-2">
                                                            <dt className="text-sm font-medium text-gray-500">Doctor's Note</dt>
                                                            <dd className="mt-1 text-sm text-gray-900">
                                                                {selectedData.note}
                                                            </dd>
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                                                            <dd className="mt-1 text-sm text-gray-900">
                                                                <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                                                                    <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                                                                        <div className="flex w-0 flex-1 items-center">
                                                                            <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                                            <span className="ml-2 w-0 flex-1 truncate">{selectedData['scans']['original']}</span>
                                                                        </div>
                                                                        <div className="ml-4 flex-shrink-0">
                                                                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                                Download
                                                                            </a>
                                                                        </div>
                                                                    </li>
                                                                    <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                                                                        <div className="flex w-0 flex-1 items-center">
                                                                            <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                                            <span className="ml-2 w-0 flex-1 truncate">{selectedData['scans']['cam']}</span>
                                                                        </div>
                                                                        <div className="ml-4 flex-shrink-0">
                                                                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                                Download
                                                                            </a>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </dd>
                                                        </div>
                                                    </dl>
                                                </div>
                                            </div>
                                            {/* <div className="divider lg:divider-horizontal" /> */}
                                            {/* ct scans */}
                                            <div className="sm:col-span-1 py-5 px-4 sm:px-6">
                                                <div className="bg-base-100 rounded-md border border-gray-200 py-4">
                                                    <h2 className="card-title px-10 -m-y-2">CT Scans</h2>
                                                    <figure className="px-3 pt-3">
                                                        <img src={lungs1} alt="Shoes" className="rounded-xl" />
                                                    </figure>


                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>


                        </div>
                    </main>
                </div>
            </>

            : <p>Loading</p>)
}