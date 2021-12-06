import React from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { GiDeathSkull } from "react-icons/gi";
import { RiMailCheckLine } from "react-icons/ri";

export default function AlienInfo({
  setAlienName,
  authCount,
  checkDay,
  setCheckDay,
}) {
  const handleClick = (checked, id) => {
    if (!checked) {
      setCheckDay([...checkDay, id]);
    } else {
      setCheckDay(checkDay.filter((e) => e !== id));
    }
  };

  return (
    <>
      <div className="md:py-12 py-8 flex-shrink-0"></div>
      <div className="px-3">
        <label
          className=" overflow-visible block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2 xl:text-2xl 2xl:text-3xl xl:pb-3 2xl:pb-5"
          htmlFor="grid-first-name"
        >
          생명체 이름
        </label>
        <input
          className="appearance-none block w-full text-gray-700 rounded py-3 px-4 md:mb-3 leading-tight focus:ring-blue-400 focus:bg-white "
          id="grid-first-name"
          type="text"
          placeholder="생명체 이름을 지어주세요."
          onChange={(e) => {
            setAlienName(e.target.value);
          }}
        ></input>
      </div>
      <div className="container md:text-left px-3 md:py-3 py-3 font-bold text-lg text-gray-700 tracking-wide xl:text-2xl 2xl:text-3xl xl:py-5 2xl:py-10">
        <div>
          챌린지 인증 요일 (총 <span style={{ color: "red" }}>{authCount}</span>
          회 선택!){" "}
        </div>
        <div className="rounded mt-3 xl:mt-5 2xl:mt-7">
          <div className="w-full">
            <div className="flex">
              <div className="m-auto flex flex-row md:gap-3 gap-1.5 pt-2 xl:pb-3 2xl:pb-5">
                <button
                  id="sun"
                  onClick={(e) => handleClick(e.target.checked, "sun")}
                  className={
                    checkDay.includes("sun")
                      ? "border-2 border-indigo-600 bg-indigo-600 rounded-lg px-3 py-2 text-indigo-200 cursor-pointer hover:bg-indigo-800 hover:text-indigo-400 xl:text-2xl 2xl:text-3xl"
                      : "border-2 border-indigo-600 rounded-lg px-3 py-2 text-indigo-400 cursor-pointer xl:text-2xl 2xl:text-3xl"
                  }
                  checked={checkDay.includes("sun") ? true : false}
                >
                  일
                </button>
                <button
                  id="mon"
                  onClick={(e) => handleClick(e.target.checked, "mon")}
                  className={
                    checkDay.includes("mon")
                      ? "border-2 border-indigo-600 bg-indigo-600 rounded-lg px-3 py-2 text-indigo-200 cursor-pointer hover:bg-indigo-800 hover:text-indigo-400"
                      : "border-2 border-indigo-600 rounded-lg px-3 py-2 text-indigo-400 cursor-pointer"
                  }
                  checked={checkDay.includes("mon") ? true : false}
                >
                  월
                </button>
                <button
                  id="tue"
                  onClick={(e) => handleClick(e.target.checked, "tue")}
                  className={
                    checkDay.includes("tue")
                      ? "border-2 border-indigo-600 bg-indigo-600 rounded-lg px-3 py-2 text-indigo-200 cursor-pointer hover:bg-indigo-800 hover:text-indigo-400"
                      : "border-2 border-indigo-600 rounded-lg px-3 py-2 text-indigo-400 cursor-pointer"
                  }
                  checked={checkDay.includes("tue") ? true : false}
                >
                  화
                </button>
                <button
                  id="wed"
                  onClick={(e) => handleClick(e.target.checked, "wed")}
                  className={
                    checkDay.includes("wed")
                      ? "border-2 border-indigo-600 bg-indigo-600 rounded-lg px-3 py-2 text-indigo-200 cursor-pointer hover:bg-indigo-800 hover:text-indigo-400"
                      : "border-2 border-indigo-600 rounded-lg px-3 py-2 text-indigo-400 cursor-pointer"
                  }
                  checked={checkDay.includes("wed") ? true : false}
                >
                  수
                </button>
                <button
                  id="thu"
                  onClick={(e) => handleClick(e.target.checked, "thu")}
                  className={
                    checkDay.includes("thu")
                      ? "border-2 border-indigo-600 bg-indigo-600 rounded-lg px-3 py-2 text-indigo-200 cursor-pointer hover:bg-indigo-800 hover:text-indigo-400"
                      : "border-2 border-indigo-600 rounded-lg px-3 py-2 text-indigo-400 cursor-pointer"
                  }
                  checked={checkDay.includes("thu") ? true : false}
                >
                  목
                </button>
                <button
                  id="fri"
                  onClick={(e) => handleClick(e.target.checked, "fri")}
                  className={
                    checkDay.includes("fri")
                      ? "border-2 border-indigo-600 bg-indigo-600 rounded-lg px-3 py-2 text-indigo-200 cursor-pointer hover:bg-indigo-800 hover:text-indigo-400"
                      : "border-2 border-indigo-600 rounded-lg px-3 py-2 text-indigo-400 cursor-pointer"
                  }
                  checked={checkDay.includes("fri") ? true : false}
                >
                  금
                </button>
                <button
                  id="sat"
                  onClick={(e) => handleClick(e.target.checked, "sat")}
                  className={
                    checkDay.includes("sat")
                      ? "border-2 border-indigo-600 bg-indigo-600 rounded-lg px-3 py-2 text-indigo-200 cursor-pointer hover:bg-indigo-800 hover:text-indigo-400"
                      : "border-2 border-indigo-600 rounded-lg px-3 py-2 text-indigo-400 cursor-pointer"
                  }
                  checked={checkDay.includes("sat") ? true : false}
                >
                  토
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="px-2 pt-8 xl:pb-3 2xl:pb-5">
          <ul className="NotiList  flex flex-col items-center">
            <ul className="border-2 rounded-lg  py-3 px-5 justify-startflex flex-col items-start text-base xl:text-lg 2xl:text-2xl">
              <li className="flex flex-row items-center">
                <AiOutlineCheck />
                <div className="pl-2 flex flex-row">
                  선택 요일에만{" "}
                  <p className="text-red-500 flex flex-row items-center px-1">
                    인증
                    <RiMailCheckLine />
                  </p>
                  할 수 있습니다.
                </div>
              </li>
              <li className="flex flex-row items-center">
                <AiOutlineCheck />
                <div className="pl-2 flex flex-row">
                  당일 미인증시 생명체는{" "}
                  <p className="text-red-500 flex flex-row items-center px-1">
                    사망 <GiDeathSkull />
                  </p>{" "}
                  합니다.
                </div>
              </li>
            </ul>
          </ul>
        </div>
      </div>
    </>
  );
}
