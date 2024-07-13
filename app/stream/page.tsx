//@ts-nocheck
'use client'
import React, {useEffect, useRef} from 'react';


const Page = () => {
    let videoRef = useRef(null)
    let photoRef = useRef(null)
    const getUserCamera = () => {
        navigator.mediaDevices?.getUserMedia({
            video: true,
            // audio: true,
        })
            .then((stream) => {
                let video = videoRef.current
                video.srcObject = stream;
                video.play()
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const takePicture = () => {
        let width = 500
        let height = width / (16 / 9)
        let photo = photoRef.current
        let video = videoRef.current
        photo.width = width
        photo.height = height
        let ctx = photo.getContext('2d')
        ctx.drawImage(video,0,0,photo.width,photo.height);
    }
    const deletePicture = () => {

    }
    useEffect(() => {
        getUserCamera()
    }, [videoRef]);
    return (
        <div className="flex flex-col items-center justify-center ">
            <div className={'flex justify-center items-center w-[90%] h-[90vh] pt-5'}>
                <video className={'w-[100%] h-[100%] rounded-lg'} ref={videoRef}></video>
            </div>
            <div className={'flex justify-center items-center py-2'}>
                <button onClick={takePicture} className={'bg-sky-400 text-white px-8 py-2 rounded-lg'}>take</button>
            </div>
            <div className={'flex justify-center items-center w-[90%] h-[90vh] '}>
                <canvas className={'w-[70%] h-[100%] rounded-lg'} ref={photoRef}></canvas>
            </div>
            <div className={'flex justify-center items-center py-2'}>
                <button onClick={deletePicture} className={'bg-red-400 text-white px-8 py-2 rounded-lg'}>delete</button>
            </div>
        </div>
    );
};

export default Page;