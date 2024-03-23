"use client";
import {FaReact, FaJs, FaBootstrap, FaSass, FaGit, FaLayerGroup, FaPalette, FaCode, FaRocket} from 'react-icons/fa';
import {SiTypescript, SiTailwindcss} from 'react-icons/si';
import {Tabs} from "../ui/tabs";
import {TbBrandNextjs} from "react-icons/tb";
import {SiMui} from "react-icons/si";
import {SiReactquery} from "react-icons/si";
import {SiFramer} from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { FaSquareGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

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
                    className="w-[95%] mx-auto xl:w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-cover backdrop-brightness-50   bg-[url(/img1.wallspic.com-purple-point-laser-space-atmosphere-6016x4000.jpg)]">
                    <p>PROFESSIONAL SUMMARY</p>
                    <div className="lg:p-8 rounded-lg shadow-lg ">
                        <div className="mb-8 mt-4 lg:mt-12">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-100 mb-4">SUMMARY</h1>
                            <p className="text-xl lg:text-lg text-gray-100 mb-4">
                                Experienced front-end developer with a strong command of React.js and Next.js
                                frameworks. Passionate about crafting seamless user experiences and implementing
                                innovative solutions to drive web development projects forward.
                            </p>
                        </div>
                        <div className="mb-8">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-100 mb-4">OBJECTIVE</h1>
                            <p className="text-xl lg:text-lg text-gray-100 mb-4">
                                To leverage my expertise in front-end development to contribute to cutting-edge
                                projects, while continuously expanding my skills and knowledge in the field.
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
                    className="w-[95%] mx-auto xl:w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold bg-cover  text-white bg-[url(/img3.wallspic.com-art-digital_art-space-magenta-blue-3840x2160.jpg)]">
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
                    className=" w-[95%] mx-auto xl:w-full  overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold bg-cover text-white bg-[url(/img3.wallspic.com-purple_and_white_abstract_painting-3840x2160.jpg)]">
                    <p>CONTACT ME</p>
                    <div className={'relative flex justify-center items-center w-[100%] h-[100%]'}>
                        {/*<div*/}
                        {/*    className={'w-[100%] bg-right h-[400px] absolute  opacity-70 bg-[url(/photo_2024-03-20_06-45-07-removebg-preview.png)] bg-contain bg-no-repeat'}></div>*/}
                        {contactMeData.map(item => (
                            <div key={item.id}
                                className="group cursor-pointer m-2 group overflow-hidden p-5 duration-1000 hover:duration-1000 relative w-1/3 h-[300px] bg-[#00000090] glass rounded-xl"
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
                                    className="w-full h-full shadow-xl shadow-neutral-900 p-3 items-center bg-neutral-600 opacity-50 rounded-xl flex-col gap-2 flex justify-center"
                                >
                                    <span className="text-neutral-50 group-hover:text-[#38bdf8] group-hover:scale-110 transition-all ease-in duration-500 font-bold text-[76px] italic">{item.icon}</span>
                                    <span className="text-neutral-50 group-hover:text-[#38bdf8] group-hover:scale-110 transition-all ease-in duration-500 font-bold text-2xl italic">{item.name}</span>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div
            className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-40">
            <Tabs tabs={tabs}/>
        </div>
    );
}

export default TabsDemo
