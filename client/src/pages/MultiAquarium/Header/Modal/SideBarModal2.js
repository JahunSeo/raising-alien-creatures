import React from "react";
import "./SideBarModal2.css";

export default function SideBarModal2 ({showModal2, closeModal2}) {
    
    return (
        <>
            <div className={showModal2 ? "Background2" : null} onClick={closeModal2} />
            <div>
                <div className={showModal2 ? "ModalContainer2":"hidden2"}></div>
            </div>
        </>
    );
}
