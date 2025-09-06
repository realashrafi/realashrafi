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
import { TextGenerateEffect } from './text-generate-effect';
import {DraggableCardBody, DraggableCardContainer} from "@/app/components/ui/draggable-card";

function TabsDemo() {
    const items = [
        {
            title: "JS (ES6)",
            image: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Javascript_Logo.png",
            className: "absolute top-10 left-[20%] rotate-[-5deg]",
        },
        {
            title: "React.js",
            image: "https://cloudmatetechnologies.com/wp-content/uploads/2024/06/react.js.png",
            className: "absolute top-40 left-[25%] rotate-[-7deg]",
        },
        {
            title: "Next.js",
            image: "https://images.ctfassets.net/23aumh6u8s0i/c04wENP3FnbevwdWzrePs/1e2739fa6d0aa5192cf89599e009da4e/nextjs",
            className: "absolute top-5 left-[40%] rotate-[8deg]",
        },
        {
            title: "PWA",
            image: "https://ps.w.org/hyper-pwa/assets/icon-256x256.png?rev=2567651",
            className: "absolute top-32 left-[55%] rotate-[10deg]",
        },
        {
            title: "Bootstrap",
            image: "https://getbootstrap.com/docs/5.3/assets/img/bootstrap-icons.png",
            className: "absolute top-20 right-[35%] rotate-[2deg]",
        },
        {
            title: "Material-UI",
            image: "https://pbs.twimg.com/profile_images/1798056830041788417/HIapkjDx_400x400.jpg",
            className: "absolute top-24 left-[45%] rotate-[-7deg]",
        },
        {
            title: "Sass",
            image: "https://willstyle.co.jp/w/wp-content/uploads/2017/11/sass-2000x1000.jpg",
            className: "absolute top-8 left-[30%] rotate-[4deg]",
        },
        {
            title: "Tailwind CSS",
            image: "https://pbs.twimg.com/profile_images/1730334391501488129/G0R0sjHH_400x400.jpg",
            className: "absolute top-15 left-[35%] rotate-[3deg]",
        },
        {
            title: "TypeScript",
            image: "https://cdn.worldvectorlogo.com/logos/typescript.svg",
            className: "absolute top-30 left-[50%] rotate-[-4deg]",
        },
        {
            title: "Git",
            image: "https://cdn.prod.website-files.com/638106149a6441f0708f5c0a/66c72620456d49ce94e2a2bb_66c72560c6e3b9a31fd0d85b_github-git-cocos-creator.webp",
            className: "absolute top-12 left-[25%] rotate-[6deg]",
        },
        {
            title: "Redux",
            image: "https://www.robots-dreams.net/img/entry/Redux.png",
            className: "absolute top-35 right-[30%] rotate-[-3deg]",
        },
        {
            title: "Context",
            image: "https://bs-uploads.toptal.io/blackfish-uploads/components/blog_post_page/4088805/cover_image/retina_1708x683/cover-react-context-api-312ade466c8ad751079fb421400c4cf9.png",
            className: "absolute top-18 left-[40%] rotate-[5deg]",
        },
        {
            title: "HTML/CSS",
            image: "https://www.cse.iitb.ac.in/~ravindramohith/Html-CSS-JS.png.crdownload",
            className: "absolute top-25 left-[20%] rotate-[-6deg]",
        },
        {
            title: "React Query",
            image: "https://res.cloudinary.com/dw6wav4jg/image/upload/v1717914209/1_elhu-42TzQEdsFjKDbQhhA_gv2meq.png",
            className: "absolute top-10 right-[25%] rotate-[4deg]",
        },
        {
            title: "Framer",
            image: "https://images.seeklogo.com/logo-png/58/1/framer-icon-logo-png_seeklogo-586477.png",
            className: "absolute top-20 left-[50%] rotate-[-5deg]",
        },
    ];
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
                    className="w-[95%] flex items-center justify-center mx-auto xl:w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-neutral-300 bg-cover backdrop-brightness-50  bg-[url(https://img3.wallspic.com/crops/6/8/3/1/8/181386/181386-light-fototapet-wall-blue-red-7680x4320.jpg)]">
                    <TextGenerateEffect duration={1} filter={false} words={`Shaping the web with React.js and Next.js→ crafting bold, interactive solutions through 4 years of fearless experimentation and refined code.`} />
                </div>
            ),
        },
        {
            title: "Skills",
            value: "skills",
            content: (
                <div
                    className="w-[95%] mx-auto xl:w-full overflow-hidden relative h-full rounded-2xl text-xl md:text-4xl font-bold bg-cover  text-white bg-[url(https://img2.wallspic.com/crops/4/0/4/2/7/172404/172404-your_name-mitsuha_miyamizu-taki_tachibana-anime-atmosphere-7680x4320.jpg)]">
                    <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
                        <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl ">
                            If its your first day at Fight Club, you have to fight.
                        </p>
                        {items.map((item,index) => (
                            <DraggableCardBody key={index} className={item.className}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="pointer-events-none relative z-10 h-80 w-80 object-cover"
                                />
                                <h3 className="mt-4 text-center text-2xl font-bold text-neutral-300">
                                    {item.title}
                                </h3>
                            </DraggableCardBody>
                        ))}
                    </DraggableCardContainer>
                </div>
            ),
        },
        {
            title: "Contact me",
            value: "contact",
            content: (
                <div
                    className=" w-[95%] mx-auto xl:w-full  overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold bg-cover text-neutral-300 bg-[url(https://img1.wallspic.com/previews/0/3/6/9/3/139630/139630-black_and_white_cat_in_blue_and_white_suit-x750.jpg)]">
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
