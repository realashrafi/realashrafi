"use client";
import {FaReact, FaJs, FaBootstrap, FaSass, FaGit, FaLayerGroup, FaPalette, FaCode, FaRocket} from 'react-icons/fa';
import {SiTypescript, SiTailwindcss} from 'react-icons/si';
import {Tabs} from "../ui/tabs";
import {TbBrandNextjs} from "react-icons/tb";
import {SiMui} from "react-icons/si";
import {SiReactquery} from "react-icons/si";

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
    ];
    const tabs = [
        {
            title: "Summary",
            value: "summary",
            content: (
                <div
                    className="w-[95%] mx-auto xl:w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-cover backdrop-brightness-50 brightness-75  bg-[url(/img1.wallspic.com-purple-point-laser-space-atmosphere-6016x4000.jpg)]">
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
                    className="w-[95%] mx-auto xl:w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold bg-cover brightness-50 text-white bg-[url(/img3.wallspic.com-art-digital_art-space-magenta-blue-3840x2160.jpg)]">
                    <p>SKILLS</p>
                    <div className="lg:p-8 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-gray-100 mb-4">Skills</h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {skills.map((skill, index) => (
                                <div key={index}
                                     className="bg-[#00000050] flex items-center justify-between hover:scale-105 transition-all ease-in p-4 rounded-lg shadow-md overflow-hidden">
                                    <div className="flex items-center space-x-2">
                                        <span>{skill.icon}</span>
                                        <p className="text-lg text-gray-100">{skill.name}</p>
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
                    className=" w-[95%] mx-auto xl:w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold bg-cover brightness-50 text-white bg-[url(/img3.wallspic.com-purple_and_white_abstract_painting-3840x2160.jpg)]">
                    <p>CONTACT ME</p>
                    <div></div>
                </div>
            ),
        },
    ];

    return (
        <div
            className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40">
            <Tabs tabs={tabs}/>
        </div>
    );
}

export default TabsDemo
// const DummyContent = () => {
//     return (
//         <Image
//             src="/linear.webp"
//             alt="dummy image"
//             width="1000"
//             height="1000"
//             className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
//         />
//     );
// };
