import React from "react";
import "./SideBarModal.css";

export default function SideBarModal ({showModal, closeModal}) {
    return (
        <>
            <div className={showModal ? "Background" : null} onClick={closeModal} />
            <div className={showModal ? "ModalContainer" : "hidden"}>
                <div>요소섹시</div>
            </div>
        </>
    );
}