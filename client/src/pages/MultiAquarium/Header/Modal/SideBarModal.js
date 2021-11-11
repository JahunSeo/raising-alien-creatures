import React, { useState } from "react";
import "./SideBarModal.css";
import SideBarModal2 from "./SideBarModal2";

export default function SideBarModal ({showModal, closeModal}) {
    const [showModal2, setShowModal2] = useState(false);
    const openModal2 = e => {
        e.stopPropagation();
        setShowModal2(true);
    }
    const closeModal2 = e => {
        e.stopPropagation();
        setShowModal2(false);
    }
    return (
        <>
            <div className={showModal ? "Background" : null} onClick={closeModal} />
            <div className={showModal ? "ModalContainer" : "hidden"}>
                <div>모달달1</div>
                <button onClick={openModal2}>모달달2ㄱㄱ</button>
                <SideBarModal2 showModal2={showModal2} closeModal2={closeModal2}></SideBarModal2>
                
            </div>
        </>
    );
}
