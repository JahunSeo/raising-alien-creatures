import React from "react";
import "./SideBarModal.css";
import PostList from "./PostList";

export default function SideBarModal ({showModal, closeModal}) {
    return (
        <>
            <div className={showModal ? "Background" : null} onClick={closeModal} />
            <div className={showModal ? "ModalContainer" : "hidden"}>
                <PostList />
            </div>
        </>
    );
}