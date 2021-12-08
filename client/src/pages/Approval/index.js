import React, { useState, useEffect } from "react";
import api from "../../apis/index.js";
import * as socket from "../../apis/socket";
import * as actions from "../../Redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import NoAuthRequest from "./NoAuthRequest.js";
import { GiSupersonicArrow } from "react-icons/gi";
import { BiLike } from "react-icons/bi";
import { AiFillLike } from "react-icons/ai";

import "./index.css";
import "./blur.css";
import classNames from "classnames/bind";

const cx = classNames.bind();

export default function Approval(props) {
  const [authRequests, setAuthRequests] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [authCategory, setAuthCategory] = useState(0);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const loadAuthRequests = async () => {
      const res = await api.get("/user/approval/list");
      if (res.data.result === "success") {
        let auths = res.data.data;
        let challenges = {};
        auths.forEach((auth) => {
          let challengeId = auth.challenge_id;
          if (!(challengeId in challenges)) {
            challenges[challengeId] = {
              id: challengeId,
              name: auth.challenge_name,
              count: 0,
            };
          }
          challenges[challengeId].count += 1;
        });
        challenges = Object.values(challenges);
        setChallenges(challenges);
        setAuthRequests(auths);
      } else {
        // TODO: 에러 처리
      }
    };
    loadAuthRequests();
  }, []);

  function ToggleBtn(props) {
    const { showFilters, setShowFilters } = props;

    return (
      <nav className="toggleBtn">
        <button
          className="w-10 h-10 focus:outline-none bg-transparent text-gray-500"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span
              aria-hidden="true"
              className={cx(
                "block absolute h-0.5 w-5 bg-gray-500 transform transition duration-500 ease-in-out",
                showFilters ? "" : "-translate-y-1.5"
              )}
            ></span>
            <span
              aria-hidden="true"
              className={cx(
                "block absolute h-0.5 w-5 bg-gray-500 transform transition duration-500 ease-in-out",
                showFilters ? "" : ""
              )}
            ></span>
            <span
              aria-hidden="true"
              className={cx(
                "block absolute h-0.5 w-5 bg-gray-500 transform transition duration-500 ease-in-out",
                showFilters ? "" : "translate-y-1.5"
              )}
            ></span>
          </div>
        </button>
      </nav>
    );
  }

  if (authRequests.length) {
    return (
      <div className="authRequests container" style={{ paddingTop: "75px" }}>
        <div className="fixed bg-white rounded-xl shadow dark:bg-gray-800 z-10">
          <ToggleBtn
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
          {showFilters ? (
            <div className="dropContent">
              <option
                value=""
                onClick={(e) => {
                  setAuthCategory(0);
                  window.scrollTo({
                    top: 100,
                    behavior: "smooth",
                  });
                  setShowFilters(false);
                }}
              >
                전체 보기 ({authRequests.length})
              </option>
              {challenges.map((challenge) => (
                <option
                  key={challenge.id}
                  value={challenge.id}
                  onClick={(e) => {
                    setAuthCategory(challenge.id);
                    window.scrollTo({
                      top: 100,
                      behavior: "smooth",
                    });
                    setShowFilters(false);
                  }}
                >
                  {challenge.name} ({challenge.count})
                </option>
              ))}
            </div>
          ) : null}
        </div>
        {authCategory === 0 ? (
          <div>
            {authRequests.map((authRequest) => (
              <AuthRequest
                key={authRequest.practice_record_id}
                authRequest={authRequest}
                authCategory={authCategory}
              />
            ))}
          </div>
        ) : (
          <div>
            {authRequests
              .filter(
                (authRequest) => authRequest.challenge_id === authCategory
              )
              .map((authRequest) => (
                <AuthRequest
                  key={authRequest.practice_record_id}
                  authRequest={authRequest}
                  authCategory={authCategory}
                />
              ))}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="noAuthRequest">
        <NoAuthRequest />
      </div>
    );
  }
}

const AuthRequest = ({ authRequest, authCategory }) => {
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // let request_date = authRequest.request_date.toLocaleStringS;
  const authYear = authRequest.request_date.slice(0, 4);
  const authMonth = authRequest.request_date.slice(5, 7);
  const authDate = authRequest.request_date.slice(8, 10);
  const authHour = authRequest.request_date.slice(11, 13);
  const authMinute = authRequest.request_date.slice(14, 16);

  const [approvalStatus, setApprovalStatus] = useState(false);
  const [approvalClicked, setApprovalClicked] = useState(false);

  const postApproval = async () => {
    const req = await api.post("/challenge/approval", {
      auth_id: authRequest.practice_record_id,
      Alien_id: authRequest.alien_id,
      request_date: authRequest.request_date,
    });
    console.log("req", req);

    if (req.data.msg === "인증 수락 가능한 날짜가 만료되었습니다.") {
      setApprovalClicked(false);
      dispatch(
        actions.setPopupModal(
          "AUTH_DATE_OUT",
          "기간이 만료된 인증 요청입니다 !",
          "FAIL",
          () => {}
        )
      );
      return;
    }
    if (req.data.msg === "이미 인증이 완료된 건 입니다.") {
      setApprovalClicked(false);
      dispatch(
        actions.setPopupModal(
          "AUTH_EXIST",
          "이미 수락이 완료된 인증 요청입니다 !",
          "FAIL",
          () => {}
        )
      );
      return;
    }
    if (req.data.result === "success") {
      setApprovalClicked(false);
      dispatch(
        actions.setPopupModal(
          "AUTH_APPROVAL",
          `${authRequest.request_user} 님의 인증을 수락하였습니다 !`,
          "SUCC",
          () => {}
        )
      );
      setApprovalStatus(true);
      // socket에 전달
      let info = {
        senderId: user.id,
        receiverId: authRequest.request_user_id,
        challengeId: authRequest.challenge_id,
        alienId: authRequest.alien_id,
        msg: `"${authRequest.challenge_name}" 챌린지에서 "${user.nickname}"님이 인증 요청을 승인했습니다.`,
      };
      socket.emitAuthApproval(info);
    }
  };

  const handleSubmit = () => {
    if (approvalClicked) return;
    setApprovalClicked(true);
    postApproval();
  };

  const handleNavigate = () => {
    navigate(`/challenge/${authRequest.challenge_id}/room`);
  };

  const image_url_origin = authRequest.image_url;
  const image_url_opt = image_url_origin.replace("origin", "M");

  const ApprovalButton = () => {
    if (!approvalStatus & !authRequest.record_status) {
      return (
        <button
          type="button"
          className="bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
          onClick={handleSubmit}
        >
          <div className="flex gap-2">
            <div className="col-span-1">
              <BiLike />
            </div>
            <div className="m-auto md:min-w-max md:text-xl text-sm truncate">
              인증 수락
            </div>
          </div>
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="bg-gradient-to-r from-indigo-600 via-pink-600 to-red-600 hover:from-indigo-500 hover:via-pink-500 hover:to-yellow-500 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
        >
          <div className="flex gap-2">
            <div className="col-span-1">
              <AiFillLike />
            </div>
            <div className="m-auto md:min-w-max md:text-xl text-sm truncate">
              인증 완료
            </div>
          </div>
        </button>
      );
    }
  };

  return (
    <div className="flex min-w-min min-h-0 md:p-12 p-6 justify-center items-center bg-gray-100">
      <div className="flex flex-col w-1/4 min-w-min bg-white rounded-lg py-2 shadow-lg  cursor-pointer">
        {/* react-lazy-load-image-component */}
        <div className="flex flex-col justify-center items-center">
          <LazyLoadImage
            className="LazyLoadImage"
            src={image_url_opt}
            onError={(e) => (e.target.src = image_url_opt)}
            alt="authImage"
            threshold="10"
            effect="blur"
          />
        </div>
        <div className="flex flex-col justify-center items-center mb-2">
          <div className="mb-2 space-x-4">
            <div className="mt-6 mb-4 md:px-8 px-4 text-center md:text-2xl text-lg text-black">
              <h1 className="inline font-bold">"{authRequest.request_user}"</h1>{" "}
              님의
              <br />
              <h1 className="inline font-bold">
                [{authRequest.challenge_name}]
              </h1>{" "}
              인증 요청
            </div>
            <div className="flex flex-col justify-center items-center md:px-8 text-center md:text-xl text-lg font-semibold text-gray-600 mt-2 mb-2">
              {authYear}년 {authMonth}월 {authDate}일 {authHour}시 {authMinute}
              분에 인증
            </div>
          </div>
        </div>
        <div>
          <div className="flex-col min-w-min w-full justify-center items-center px-6 py-2">
            <div className="flex-col m-auto bg-gray-300 rounded-lg px-2 py-2">
              <h1 className="flex justify-center items-center py-2 mb-1 md:text-xl text-center text:lg font-semibold text-black">
                "{authRequest.comments}"
              </h1>
            </div>
          </div>
        </div>
        <div className="flex min-w-min items-center justify-between px-6 md:py-6 py-2 md:gap-4 gap-2">
          <ApprovalButton />
          <button
            type="button"
            className="flex text-center justify-center items-center min-w-min min-h-0 max-w-sm w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
            onClick={handleNavigate}
          >
            <div className="flex gap-2">
              <div className="col-span-1">
                <GiSupersonicArrow />
              </div>
              <div className="m-auto md:min-w-max md:text-xl text-sm truncate">
                챌린지룸 이동
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
