import { Fragment, useState } from 'react'
import { Disclosure, Menu, Transition, Listbox } from '@headlessui/react'
import axios from "axios";
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ScanCard from '../components/ScanCard'
import PatientView from '../components/PatientViewer/PatientView'
import PatientViewer from '../components/PatientViewer/PatientViewer'
import { PaperClipIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
const patients = [
    { id: 1, name: 'Patient 1' },
    { id: 2, name: 'Patient 2' },
    { id: 3, name: 'Patient 3' },
    { id: 4, name: 'Patient 4' },
    { id: 5, name: 'Patient 5' },

]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function PatientPortal() {
    const [selected, setSelected] = useState(patients[0])
    const [imgCT, setImg] = useState('https://thumbs.dreamstime.com/b/golden-retriever-dog-21668976.jpg')

    const testReq = () => {
        const packet = {
            id: 5
        };



        setImg("./database/patient5/26.png");
    };

    const selectChange = (event) => {
        console.log(event);
        console.log(selected);
        setSelected(event);




    };


    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
            <div className="max-h-full">


                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-black">Patient Dashboard</h1>
                    </div>
                </header>
                <div className="p-2 flex">
                    <p className="mt-1.5 mr-1.5">This is a demonstration of the portal for a patient.</p>
                    <button onClick={testReq}>yo </button>
                    <Listbox value={selected} onChange={selectChange}>
                        {({ open }) => (
                            <>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                        <span className="block truncate">{selected.name}</span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {patients.map((patient) => (
                                                <Listbox.Option
                                                    key={patient.id}
                                                    className={({ active }) =>
                                                        classNames(
                                                            active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                            'relative cursor-default select-none py-2 pl-3 pr-9'
                                                        )
                                                    }
                                                    value={patient}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                {patient.name}
                                                            </span>

                                                            {selected ? (
                                                                <span
                                                                    className={classNames(
                                                                        active ? 'text-white' : 'text-indigo-600',
                                                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                    )}
                                                                >
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                </div>
                <div className="grid grid-cols-1 justify-center sm:grid-cols-3 gap-x-4 overflow-y-auto px-4">
                    {/* information */}



                    <div className="sm:col-span-1 overflow-scroll max-h-[75%] border-gray-200 border rounded-md ">
                        <div className="bg-base-100 py-4">

                            <div className="px-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Your Scan Results</h3>
                                <p className="max-w-2xl text-sm text-gray-500">Personal details and application.</p>
                            </div>
                            <figure className="px-4 pt-4 rounded-md">
                                <img className="rounded-md" src={imgCT} />
                                <input type="checkbox" className="toggle toggle-xs" checked />
                            </figure>


                            <div className="border-gray-200 px-4 py-5 sm:px-6">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Full name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">Margot Foster</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Application for</dt>
                                        <dd className="mt-1 text-sm text-gray-900">Backend Developer</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                        <dd className="mt-1 text-sm text-gray-900">margotfoster@example.com</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Salary expectation</dt>
                                        <dd className="mt-1 text-sm text-gray-900">$120,000</dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">About</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur
                                            qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud
                                            pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                                                <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                                                    <div className="flex w-0 flex-1 items-center">
                                                        <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                        <span className="ml-2 w-0 flex-1 truncate">resume_back_end_developer.pdf</span>
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
                                                        <span className="ml-2 w-0 flex-1 truncate">coverletter_back_end_developer.pdf</span>
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

                    </div>
                    {/* <div className="divider lg:divider-horizontal" /> */}
                    {/* chatgpt */}
                    <div className="sm:col-span-1 max-h-[75%] border-gray-200 border rounded-md flex-col flex">
                        <div className="flex-col flex flex-1 justify-between rounded-md">
                            <div className="px-5 pb-2 pt-2 bg-gray-200 rounded-t-md">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">AI Assistant</h3>
                                <p className="max-w-2xl text-sm text-gray-500">Ask me anything about your diagnosis!</p>
                            </div>
                            <div>
                                <div className=" border-t border-b px-2 overflow-y-auto grow shrink max-h-full">
                                    <div className="chat chat-start">
                                        <div className="chat-bubble">It's over Anakin, <br />I have the high ground.</div>
                                    </div>
                                    <div className="chat chat-end">
                                        <div className="chat-bubble">You underestimate my power!</div>
                                    </div>
                                    <div className="chat chat-start">
                                        <div className="chat-bubble">It's over Anakin, <br />I have the high ground.</div>
                                    </div>
                                    <div className="chat chat-end">
                                        <div className="chat-bubble">You underestimate my power!</div>
                                    </div>
                                    <div className="chat chat-start">
                                        <div className="chat-bubble">It's over Anakin, <br />I have the high ground.</div>
                                    </div>
                                    <div className="chat chat-end">
                                        <div className="chat-bubble">You underestimate my power!</div>
                                    </div>
                                    <div className="chat chat-start">
                                        <div className="chat-bubble">It's over Anakin, <br />I have the high ground.</div>
                                    </div>
                                    <div className="chat chat-end">
                                        <div className="chat-bubble">You underestimate my power!</div>
                                    </div>
                                    <div className="chat chat-start">
                                        <div className="chat-bubble">It's over Anakin, <br />I have the high ground.</div>
                                    </div>
                                    <div className="chat chat-end">
                                        <div className="chat-bubble">You underestimate my power!</div>
                                    </div>
                                    <div className="chat chat-start">
                                        <div className="chat-bubble">It's over Anakin, <br />I have the high ground.</div>
                                    </div>


                                </div>
                            </div>
                            <div className="mt-auto ">
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        className="block w-full rounded-b-md pr-12 border-transparent shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex py-1 pr-1">
                                        <kbd className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
                                            Send
                                        </kbd>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                <div className="">

                </div>

            </div>
        </>
    )
}
