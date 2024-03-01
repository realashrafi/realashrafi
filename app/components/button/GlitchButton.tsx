import React from 'react';
import './glitchButtonCss.css'
const GlitchButton = ({data,id}:any) => {
    return (
        <div className="container cursor-default">
            <div className="radio-wrapper">
                <input className="input" name="btn" id="value-2" checked={true} type="checkbox"/>
                    <div className="btn">
                        {/*// @ts-ignore*/}
                        {data}<span aria-hidden="">_</span>
                        {/*// @ts-ignore*/}
                        <span className="btn__glitch" aria-hidden="">_{data}_</span>
                        <label className="number">{id}</label>
                    </div>
            </div>
        </div>


);
};

export default GlitchButton;