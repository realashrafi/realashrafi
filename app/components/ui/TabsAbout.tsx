"use client";
import {FaReact, FaJs, FaBootstrap, FaSass, FaGit, FaLayerGroup, FaPalette, FaCode, FaRocket} from 'react-icons/fa';
import {SiTypescript, SiTailwindcss} from 'react-icons/si';
import {Tabs} from "../ui/tabs";
import {TbBrandNextjs} from "react-icons/tb";
import {SiMui} from "react-icons/si";
import {SiReactquery} from "react-icons/si";
import {SiFramer} from "react-icons/si";
import {MdEmail} from "react-icons/md";
import {FaSquareGithub} from "react-icons/fa6";
import {FaLinkedin} from "react-icons/fa";
import {SummaryJson} from "@/app/store/json";

function TabsDemo() {
    const skills = [
        {name: "JS (ES6)", icon: <FaJs/>},
        {name: "React.js", icon: <FaReact/>},
        {name: "Next.js", icon: <TbBrandNextjs/>},
        {name: "PWA", icon: <FaRocket/>},
        {name: "Bootstrap", icon: <FaBootstrap/>},
        {name: "Material-UI", icon: <SiMui/>},
        {name: "Sass", icon: <FaSass/>},
        {name: "Tailwind CSS", icon: <SiTailwindcss/>},
        {name: "TypeScript", icon: <SiTypescript/>},
        {name: "Git", icon: <FaGit/>},
        {name: "Redux", icon: <FaLayerGroup/>},
        {name: "Context", icon: <FaPalette/>},
        {name: "HTML/CSS", icon: <FaCode/>},
        {name: "React Query", icon: <SiReactquery/>},
        {name: "Framer", icon: <SiFramer/>},
    ];
    const contactMeData = [
        {id: 1, name: "Email", icon: <MdEmail/>, url: 'ccvali@outlook.com'},
        {id: 2, name: "Linkedin", icon: <FaLinkedin/>, url: 'https://www.linkedin.com/in/realashrafi/'},
        {id: 3, name: "Github", icon: <FaSquareGithub/>, url: 'https://github.com/realashrafi'},
    ]
    const tabs = [
        {
            title: "Summary",
            value: "summary",
            content: (
                <div
                    className="w-[95%] mx-auto xl:w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-neutral-300 bg-cover backdrop-brightness-50  bg-[url(/img1.wallspic.com-purple-point-laser-space-atmosphere-6016x4000.jpg)]">
                    <p>PROFESSIONAL SUMMARY</p>
                    <div className="lg:p-4 mt-4 rounded-lg shadow-lg ">
                        <div className="mb-6">
                            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-300 mb-4">{'OBJECTIVE'}</h1>
                            <p className="text-xl lg:text-lg text-neutral-300 mb-4">
                                {SummaryJson}
                            </p>
                        </div>
                        <div className="mb-6">
                            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-300 mb-4">{'Experience'}</h1>
                            <p className="text-xl lg:text-lg text-neutral-300 mb-4">
                                {' Front-end Developer | Ideal Media Makeen Institute\n' +
                                    '                                2023-2024  Developed and maintained front-end components for web applications\n' +
                                    '                                using React.js and Next.js.  Implemented responsive designs using Tailwind CSS and Bootstrap. - Integrated Material-UI (MUI) components for enhanced user interfaces. - Contributed to the development of Progressive Web Applications\n' +
                                    '                                (PWA) for improved user experience.  Collaborated with cross-functional teams to deliver high-quality and\n' +
                                    '                                scalable software solutions.'}
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Skills",
            value: "skills",
            content: (
                <div
                    className="w-[95%] mx-auto xl:w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold bg-cover  text-white bg-[url(/img2.jpg)]">
                    <p>SKILLS</p>
                    <div className="lg:p-8 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-gray-100 mb-4">Im Working With</h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {skills.map((skill, index) => (
                                <div key={index}
                                     className="bg-[#00000050] group flex items-center justify-between hover:scale-105 transition-all ease-in p-4 rounded-lg shadow-md overflow-hidden">
                                    <div className="flex items-center group-hover:text-[#38bdf8] space-x-2">
                                        <span>{skill.icon}</span>
                                        <p className="text-lg group-hover:text-[#38bdf8] text-gray-100">{skill.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Contact me",
            value: "contact",
            content: (
                <div
                    className=" w-[95%] mx-auto xl:w-full  overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold bg-cover text-neutral-300 bg-[url(/img1.jpg)]">
                    <p>CONTACT ME</p>
                    <div
                        className={'relative flex-wrap lg:flex-nowrap flex justify-center items-center w-[100%] h-[100%]'}>
                        {/*<div*/}
                        {/*    className={'w-[100%] bg-right h-[400px] absolute  opacity-70 bg-[url(/photo_2024-03-20_06-45-07-removebg-preview.png)] bg-contain bg-no-repeat'}></div>*/}
                        {contactMeData.map(item => (
                            <a href={item.url} key={item.id}
                               className="group cursor-pointer m-2 group overflow-hidden p-5 duration-1000 hover:duration-1000 relative w-[95%] lg:w-1/3 h-[300px] bg-[#00000090] glass rounded-xl"
                            >
                                <div
                                    className="bg-transparent group-hover:scale-150 -top-12 -left-12 absolute shadow-yellow-800 shadow-inner rounded-full transition-all ease-in-out group-hover:duration-1000 duration-1000 w-24 h-24"
                                ></div>
                                <div
                                    className="bg-transparent group-hover:scale-150 top-44 left-14 absolute shadow-red-800 shadow-inner rounded-full transition-all ease-in-out group-hover:duration-1000 duration-1000 w-24 h-24"
                                ></div>
                                <div
                                    className="bg-transparent group-hover:scale-150 top-24 left-56 absolute shadow-sky-800 shadow-inner rounded-full transition-all ease-in-out group-hover:duration-1000 duration-1000 w-24 h-24"
                                ></div>
                                <div
                                    className="bg-transparent group-hover:scale-150 top-12 left-12 absolute shadow-red-800 shadow-inner rounded-full transition-all ease-in-out group-hover:duration-1000 duration-1000 w-12 h-12"
                                ></div>
                                <div
                                    className="bg-transparent group-hover:scale-150 top-12 left-12 absolute shadow-green-800 shadow-inner rounded-full transition-all ease-in-out group-hover:duration-1000 duration-1000 w-44 h-44"
                                ></div>
                                <div
                                    className="bg-transparent group-hover:scale-150 -top-24 -left-12 absolute shadow-sky-800 shadow-inner rounded-full transition-all ease-in-out group-hover:duration-1000 duration-1000 w-64 h-64"
                                ></div>
                                <div
                                    className="bg-transparent group-hover:scale-150 top-24 left-12 absolute shadow-sky-500 shadow-inner rounded-full transition-all ease-in-out group-hover:duration-1000 duration-1000 w-4 h-4"
                                ></div>
                                <div
                                    className="w-full h-full shadow-xl shadow-neutral-900 p-3 items-center bg-[#EEEEEE50] rounded-xl flex-col gap-2 flex justify-center"
                                >
                                    <span
                                        className="text-neutral-300 group-hover:text-[#38bdf8] group-hover:scale-110 transition-all ease-in duration-500 font-bold text-[76px] italic">{item.icon}</span>
                                    <span
                                        className="text-neutral-300 group-hover:text-[#38bdf8] group-hover:scale-110 transition-all ease-in duration-500 font-bold text-2xl italic">{item.name}</span>
                                </div>
                            </a>

                        ))}
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div
            className="h-[90rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-40">
            <Tabs tabs={tabs}/>
        </div>
    );
}

export default TabsDemo
