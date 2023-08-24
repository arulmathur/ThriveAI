import { Fragment, useState, useRef, useEffect, useCallback } from 'react'
import { Disclosure, Menu, Transition, Listbox } from '@headlessui/react'
import axios from "axios";
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ScanCard from '../components/ScanCard'
import PatientView from '../components/PatientViewer/PatientView'
import PatientViewer from '../components/PatientViewer/PatientViewer'
import { PaperClipIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const { Configuration, OpenAIApi } = require("openai");


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function PatientPortal() {
    const [imgCT, setImg] = useState('https://thumbs.dreamstime.com/b/golden-retriever-dog-21668976.jpg')
    const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    const responding = "Responding..."
    const submit = "Submit";
    const [input, setInput] = useState("");

    const [prompts, setPrompts] = useState(["What can you do?"]);
    const [apiResponse, setApiResponse] = useState(["Hi, I am your personal healthcare assistant. I am based off the Davinci model by OpenAI. This chat will convey your information to OpenAI for processing."]);
    const [loading, setLoading] = useState(false);
    /*
  
  You are a chat bot on a medical imaging platform. 
  Your role is to answer questions about a lung scan showing a covid-19 diagnosis. 
  The lung scan contains a GradCAM image from an AI analysis indicating signs of a positive covid 19 diagnosis. 
  The doctor's notes are as follows: you have been diagnosed with covid 19. You have clouding in your lungs and a difficulty breathing. 
  Next steps include quarantining for 14 days and managing symptoms. 
  Limit responses to 2 sentences, and word your explanations like I am someone who has 100 IQ.

    */

    const init = "You are a chat bot on a medical imaging platform. Your role is to answer questions about a lung scan pertaining to whether or not someone has covid. The lung scan contains a GradCAM image from an AI analysis indicating the biological features that contributed to their diagnosis. You are permitted to access verified information about COVID-19. If you do not understand the question, say you can not answer. Introduce what you do in a simple and concise way, if asked.";
    const handleSubmit = async (e) => {
        e.preventDefault();
        setInput("")
        setPrompts(prompts => [...prompts, input])
        setLoading(true);
        const result = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: init + input,
            temperature: 0.5,
            max_tokens: 1000,
        });
        console.log("response", result.data.choices[0].text);

        setApiResponse(apiResponse => [...apiResponse, result.data.choices[0].text]);
        console.log("api", apiResponse)
        setLoading(false)


    };


    const fetchData = useCallback(async () => {
        const t = sessionStorage.getItem('token')

        let packet = {
            'token': JSON.parse(t),
            'id': JSON.parse(t)['id']
        }
        console.log("here's my packet");
        console.log(packet);
        axios.post('/get_patient', packet)
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
    const [patientData, setPatientData] = useState();

    return (patientData ?
        <div className="max-h-full">


            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-black">Patient Dashboard</h1>
                </div>
            </header>

            <div className="grid grid-cols-1 justify-center sm:grid-cols-3 gap-x-4 p-4">
                {/* information */}



                <div className="sm:col-span-2 overflow-scroll max-h-[75%] border-gray-200 border rounded-md ">
                    <div className="bg-base-100 py-4">

                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">For medical purposes.</p>
                        </div>

                        <figure className="px-4 pt-4 rounded-md">
                            <img className="rounded-md" src={patientData.scans.cam} />

                        </figure>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Age</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{patientData.info.age}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Sex</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{patientData.info.sex}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">COVID Test</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{patientData.hasCovid ? "Positive" : "Negative"}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">ID</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{patientData.id}</dd>
                                </div>



                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Doctor's Note</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {patientData.note}
                                    </dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                                            <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                                                <div className="flex w-0 flex-1 items-center">
                                                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    <span className="ml-2 w-0 flex-1 truncate">{patientData['scans']['original']}</span>
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
                                                    <span className="ml-2 w-0 flex-1 truncate">{patientData['scans']['cam']}</span>
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
                <div className="sm:col-span-1 border-gray-200 border rounded-md " style={{ maxHeight: "75%" }}>

                    <div className="overflow-scroll rounded-md " style={{ height: "calc(100% - 60px)", marginTop: "" }}>




                        <div className="rounded-lg max-h-80% overflow-y-scroll rounded-box bg-netural pt-4">
                            {apiResponse.map((res, i) => {
                                return (
                                    <div>
                                        <div class="chat chat-end">
                                            <div class="chat-bubble chat-bubble-primary text_white">{prompts[i]}</div>
                                        </div>
                                        <div class="chat chat-start">
                                            <div class="chat-bubble chat-bubble-neutral">{res}</div>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>



                    </div>
                    <div className="flex flex-row  w-[100%] border-t pt-1 pl-1 h-[60px]">
                        <input type="text"
                            placeholder="Ask to learn more..."
                            className="input input-bordered w-[100%] font-medium"
                            onChange={(e) =>
                                setInput(e.target.value)
                            }
                        />
                        <div className="">
                            <button className="btn btn-primary normal-case text-white "
                                disabled={input.length === 0}
                                type="submit"
                                onClick={handleSubmit}>
                                {!loading ? submit : responding}
                            </button>
                        </div>
                    </div>
                </div>


            </div>



        </div> : <div>Loading</div>)
}
