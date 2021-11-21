import React from "react";
import { useParams } from "react-router-dom";
import styles from "./index.module.css";

import DeanImage from "../../image/dean.png";

export default function NewChallenge(props) {
  let params = useParams();
  console.log("New Challenge params", params);
  // TODO: login 상태일 때만 접근할 수 있음
  // TODO: 챌린지에 접근 가능한 유저인지 확인해주어야 함
  return (
    <div className={styles.body}>
      <div className=" border w-1/2 md:w-1/2 px-3">
        <label
          className=" overflow-visible block uppercase tracking-wide text-gray-700 text-s font-bold mb-2"
          for="grid-first-name"
        >
          생명체 이름
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:ring-blue-400 focus:bg-white"
          id="grid-first-name"
          type="text"
          placeholder="김진영"
        ></input>
      </div>

      <div className="border container top-60 border-gray-500 w-1/2 px-3 py-3 mb-3">
        <ul className="relative px-1 py-1 inline-flex">
          <li className=" mr-1 inline-block ">
            <a
              className="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold"
              href="#"
            >
              기본
            </a>
          </li>
          <li className="mr-1 inline-block">
            <a
              className="bg-white inline-block py-2 px-4 text-blue-500  font-semibold"
              href="#"
            >
              꾸미기
            </a>
          </li>
          {/* <li className="mr-1">
            <a
              className="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"
              href="#"
            >
              ㅎㅇㅎㅇ
            </a>
          </li> */}
        </ul>
        <div className="border md:p-3">
          <div class={styles.slider}>
            <input type="radio" name="slide" id="slide1" checked />
            <input type="radio" name="slide" id="slide2" />
            <input type="radio" name="slide" id="slide3" />
            <input type="radio" name="slide" id="slide4" />
            <ul id="imgholder" class="imgs">
              {/* <li>
                <img src={DeanImage} alt={"ㅅㄱㅅㄱ"} />
              </li> */}
              <li>
                <img className="" src={DeanImage} alt={"ㅅㄱㅅㄱ"} />
              </li>
              <li>
                <img src={DeanImage} alt={"ㅅㄱㅅㄱ"} />
              </li>
              <li>
                <img src={DeanImage} alt={"ㅅㄱㅅㄱ"} />
              </li>
            </ul>
            <div class="bullets">
              <label for="slide1">&nbsp;ㅗㅑㅗㅑ</label>
              <label for="slide2">&nbsp;</label>
              <label for="slide3">&nbsp;</label>
              <label for="slide4">&nbsp;</label>
            </div>
          </div>
        </div>
      </div>
      <button className=" bottom-0 border py-1 px-3 rounded shadow-sm text-white bg-blue-500 hover:bg-blue-600 font-semibold">
        생명체 생성
      </button>
    </div>
  );
}
