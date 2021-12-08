import React from "react";
import styles from "./PersonalItem.module.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
import { Link } from "react-router-dom";
import api from "../../../../apis/index";
import ProfileImage from './ProfileImage'
import { FaFish, FaBirthdayCake, FaGraduationCap } from 'react-icons/fa'
import { GiSupersonicArrow } from "react-icons/gi";
import { BiLike } from 'react-icons/bi'
import { DAY_TEXT } from "../../../../shared/lib/Constants";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const MyItem = React.memo(function MyItem({ alien, handleSelectAlien }) {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => ({
    userId: state.user.user.id,
  }));

  const todayValue = new Date().getDay();
  const isPracticeDay = !!alien[DAY_TEXT[todayValue].en]

  const onClickGraduate = async () => {
    let req = { alien_id: alien.id, challenge_id: alien.challenge_id };
    let res = await api.post("/alien/graduation", req);
    if (res.data.result === "success")
      dispatch(
        actions.setPopupModal(
          "GRADUATE_ALIEN",
          `${alien.alien_name} 졸업했습니다`,
          "SUCC",
          () => {
            dispatch(actions.graduate(alien.id, alien.challenge_id));
          }
        )
      );
  };

  return (
    <div
      className={styles.PostItemBlock}
      onClick={() => handleSelectAlien(alien.id)}
    >
      <h2>챌린지 : "{alien.challenge_name}"</h2>
      <div className={styles.Content}>
        <ProfileImage
          image_url={alien.image_url}
          alien_status={alien.alien_status}
          practice_status={alien.practice_status}
          isPracticeDay={isPracticeDay}
        />
        <div className={styles.SubInfo}>
          <p><FaFish size={20} />{alien.alien_name}</p>
          <p><FaBirthdayCake size={20} />{alien.created_date.split("T")[0]}</p>
          <p><BiLike size={20} />{alien.accumulated_count}번</p>
        </div>
      </div>
      <div className={styles.buttons}>
        {alien.alien_status === 0 && alien.user_info_id === userId && (
          <PracticeBtn
            className={styles.StyledButton}
            alien={alien}
            isPracticeDay={isPracticeDay}
            handleClick={() => {
              dispatch(actions.selectAlien(alien.id));
              dispatch(actions.showAuthRequest(true))
            }}
          />
        )}

        {alien.alien_status === 0 &&
          <Link to={`/challenge/${alien.challenge_id}/room`}>
            <button className={styles.StyledButton}> <GiSupersonicArrow /> 챌린지 어항</button>
          </Link>
        }

        {alien.alien_status === 0 && alien.user_info_id === userId && (
          <button className={styles.StyledButton} onClick={onClickGraduate}>
            <FaGraduationCap />
            졸업하기
          </button>
        )}
      </div>
    </div>
  );
});

export default MyItem;

function PracticeBtn(props) {
  const { alien, handleClick, isPracticeDay } = props;
  if (alien.alien_status === 1) {
    // 졸업
    return <p className={cx("StyledButton", "btn--graduated", "btn--disabled")}>졸업</p>;
  }
  else if (!isPracticeDay) {
    // not today
    return (
      <p className={cx("StyledButton", "btn--complete", "btn--disabled")}>쉬는 날</p>
    );
  }
  else if (alien.practice_status === 1) {
    // 확인 대기
    return (
      <p className={cx("StyledButton", "btn--disabled")}>확인 대기</p>
    );
  }
  else if (alien.practice_status === 2) {
    // 인증 완료
    return (
      <p className={cx("StyledButton", "btn--complete", "btn--disabled")}>인증 완료</p>
    );
  }
  else {
    // 인증하기
    return (
      <p className={cx("StyledButton", "btn--pink")} onClick={handleClick}>
        <BiLike />
        인증하기
      </p>
    );
  }
}