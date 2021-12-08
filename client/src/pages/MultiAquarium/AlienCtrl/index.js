import React from "react";
import { Link, useMatch } from "react-router-dom";
import { GiSupersonicArrow } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { DAY_TEXT } from "../../../shared/lib/Constants";
import * as actions from "../../../Redux/actions";
import aquarium from "../../../shared";
import styles from "./index.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function AlienCtrl(props) {
  const { user, aliens, selectedAlien, challenge } = useSelector(
    ({ user, room }) => ({
      user: user.user,
      aliens: room.aliens,
      selectedAlien: room.selectedAlien,
      challenge: room.challenge,
    })
  );

  let alien = aliens.find((a) => a.id === selectedAlien);

  const challengeMatch = useMatch("/challenge/:challengeId/room");
  const userMatch = useMatch("/user/:userId/room");
  const mainMatch = useMatch("/");

  const dispatch = useDispatch();
  // const [toggle, setToggle] = useState(true);

  if (!!mainMatch) {
    // todo 조건 강화!
    if (!alien) {
      return (
        <div className={cx("body", "body--main")}>
          <p>챌린지에 참가해 나만의 생명체를 키워보세요!</p>
        </div>
      );
    } else {
      return (
        <div className={cx("body", "body--selected")}>
          <div className={cx("row")}>
            <h3 className={styles.challengeName}>
              <GiSupersonicArrow />
              {`${alien.challenge_name}`}
            </h3>
          </div>
          {/* <div className={cx("row")}>
            <p className={styles.userName}>
              {`"${alien.user_nickname}"의 ${alien.alien_name}`}
            </p>
          </div> */}
          <div className={cx("btnRow", "btnRow--short-top")}>
            {
              <Link to={`/challenge/${alien.challenge_id}/room`}>
                <p className={cx("btn")}>챌린지 구경하기</p>
              </Link>
            }
          </div>
        </div>
      );
    }
  }

  if (!!challengeMatch) {
    const { challengeId } = challengeMatch.params;
    // 본 챌린지에 참가중인지 확인
    let participating = false;
    let myAlienId = null;
    if (user.login && user.challenges) {
      participating =
        user.challenges.findIndex((c) => c.id === Number(challengeId)) !== -1;
      if (participating) {
        let alien = aliens.find((a) => a.user_info_id === Number(user.id));
        myAlienId = !!alien && alien.id;
      }
    }
    // console.log(challengeId, challenge);

    if (!alien) {
      if (!user.login) {
        return (
          <div className={cx("body")}>
            <p>챌린지에 참가하면 생명체가 생성됩니다!</p>
            <div className={cx("btnRow", "btnRow--short-top")}>
              <p className={cx("subtext", "subtext--highlight")}>
                먼저 로그인을 해주세요
              </p>
            </div>
          </div>
        );
      } else if (!!participating) {
        const room = aquarium.getCurrentRoom();
        const handleSelect = () => {
          if (room && myAlienId) {
            dispatch(actions.selectAlien(myAlienId));
            const alien = room.getMonster(myAlienId);
            room.camera.setChasingTarget(alien, () => {
              dispatch(actions.selectAlien(null));
            });
          }
        };

        return (
          <div className={cx("body")}>
            <p>참가중인 챌린지입니다</p>
            <p className={cx("subtext", "subtext--highlight")}>
              사진으로 인증하고
              <br />
              다른 참가자에게 확인을 요청하세요!
            </p>
            <div className={cx("btnRow")}>
              <p className={cx("btn")} onClick={handleSelect}>
                나의 생명체 보기
              </p>
            </div>
          </div>
        );
      } else if (challenge.participant_number < challenge.maximum_number) {
        return (
          <div className={cx("body")}>
            <p>챌린지에 참가하면 생명체가 생성됩니다!</p>
            <div className={cx("btnRow", "btnRow--short-top")}>
              <p className={cx("subtext", "subtext--highlight")}>
                참가하기 버튼을 눌러주세요
              </p>
            </div>
            {/* <div className={cx("btnRow")}>
              <Link to={`/challenge/${challengeId}/join`} className={cx("btn")}>
                참가하기
              </Link>
            </div> */}
          </div>
        );
      } else {
        return (
          <div className={cx("body")}>
            <p>이미 풀방입니다 ㅜㅜ</p>
            <p className={cx("subtext")}>다른 챌린지를 검색해보세요!</p>
            <div className={cx("btnRow", "btnRow--short-top")}>
              <Link to="/" className={cx("btn")}>
                챌린지 검색하기
              </Link>
            </div>
          </div>
        );
      }
    } else {
      const todayValue = new Date().getDay();
      const isPracticeDay = !!alien[DAY_TEXT[todayValue].en];

      return (
        <div className={cx("body", "body--selected")}>
          <div className={cx("row")}>
            <h3 className={styles.challengeName}>{`${alien.user_nickname}`}</h3>
          </div>
          <div className={cx("row")}>
            <p className={styles.userName}>
              {`${alien.alien_name}`}
              <span className={styles.authCnt}>
                {` (${alien.accumulated_count}회 인증)`}
              </span>
            </p>
          </div>
          <ul className={styles.daylist}>
            {[0, 1, 2, 3, 4, 5, 6].map((day) => {
              let dayType = "default";
              if (!!alien[DAY_TEXT[day].en]) dayType = "selected";
              if (day === todayValue && isPracticeDay) dayType = "today";
              // if (!!alien[day] && (new Date()).getDay() = )
              return (
                <li key={day} className={cx("day", `day--${dayType}`)}>
                  {DAY_TEXT[day].kr}
                </li>
              );
            })}
          </ul>
          <div className={styles.btnRow}>
            {user.login && user.id === parseInt(alien.user_info_id) ? (
              <PracticeBtn
                alien={alien}
                isPracticeDay={isPracticeDay}
                handleClick={() => dispatch(actions.showAuthRequest(true))}
              />
            ) : (
              <Link to={`/user/${alien.user_info_id}/room`}>
                <p className={cx("btn")}>참가자 어항</p>
              </Link>
            )}
          </div>
          {user.login && user.id === parseInt(alien.user_info_id) && (
            <AlienNoti alien={alien} isPracticeDay={isPracticeDay} />
          )}
        </div>
      );
    }
  }

  if (!!userMatch) {
    let { userId } = userMatch.params;
    let isMyRoom = user.login && user.id === parseInt(userId);

    if (!!alien) {
      const todayValue = new Date().getDay();
      const isPracticeDay = !!alien[DAY_TEXT[todayValue].en];

      return (
        <div className={cx("body", "body--selected")}>
          <div className={cx("row")}>
            <h3
              className={styles.challengeName}
            >{`${alien.challenge_name}`}</h3>
          </div>
          <div className={cx("row")}>
            <p className={styles.userName}>
              {`${alien.alien_name}`}
              <span className={styles.authCnt}>
                {` (${alien.accumulated_count}회 인증)`}
              </span>
            </p>
          </div>

          <ul className={styles.daylist}>
            {[0, 1, 2, 3, 4, 5, 6].map((day) => {
              let dayType = "default";
              if (!!alien[DAY_TEXT[day].en]) dayType = "selected";
              if (day === todayValue && isPracticeDay) dayType = "today";
              // if (!!alien[day] && (new Date()).getDay() = )
              return (
                <li key={day} className={cx("day", `day--${dayType}`)}>
                  {DAY_TEXT[day].kr}
                </li>
              );
            })}
          </ul>
          <div className={styles.btnRow}>
            <Link to={`/challenge/${alien.challenge_id}/room`}>
              <p className={cx("btn")}>챌린지 어항</p>
            </Link>
            {user.login && user.id === parseInt(alien.user_info_id) && (
              <PracticeBtn
                alien={alien}
                isPracticeDay={isPracticeDay}
                handleClick={() => dispatch(actions.showAuthRequest(true))}
              />
            )}
          </div>
          <AlienNoti alien={alien} isPracticeDay={isPracticeDay} />
        </div>
      );
    } else if (!!isMyRoom) {
      if (aliens.length <= 0) {
        return (
          <div className={cx("body")}>
            <p>참여중인 챌린지가 없습니다</p>
            <div className={cx("btnRow", "btnRow--short-top")}>
              <p className={cx("subtext")}>
                챌린지에 참가해 생명체를 생성해주세요!
              </p>
            </div>
            <div className={cx("btnRow")}>
              <Link to="/" className={cx("btn")}>
                챌린지 검색하기
              </Link>
            </div>
          </div>
        );
      } else if (!alien) {
        return (
          <div className={cx("body")}>
            <p>
              사진으로 챌린지를 인증하고
              <br />
              다른 참가자에게 확인을 요청하세요!
            </p>
            <div className={cx("notiRow")}>
              <p className={cx("notiText", "notiText--highlight")}>
                (빨간 물방울) 오늘 인증하지 않으면 죽어요
              </p>
            </div>
            <div className={cx("notiRow")}>
              <p className={cx("notiText")}>
                (투명 물방울) 오늘 확인을 받아야 성장해요
              </p>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className={cx("body")}>
          <p>다른 참가자의 어항도 마음껏 구경해보세요!</p>
        </div>
      );
    }
  }
}

function PracticeBtn(props) {
  const { alien, handleClick, isPracticeDay } = props;
  if (alien.alien_status === 1) {
    // 졸업
    return <p className={cx("btn", "btn--graduated", "btn--disabled")}>졸업</p>;
  } else if (!isPracticeDay) {
    // not today
    return (
      <p className={cx("btn", "btn--complete", "btn--disabled")}>쉬는 날</p>
    );
  } else if (alien.practice_status === 1) {
    // 확인 대기
    return (
      <p className={cx("btn", "btn--ready", "btn--disabled")}>확인 대기</p>
    );
  } else if (alien.practice_status === 2) {
    // 인증 완료
    return (
      <p className={cx("btn", "btn--complete", "btn--disabled")}>인증 완료</p>
    );
  } else {
    // 인증하기
    return (
      <p className={cx("btn", "btn--pink")} onClick={handleClick}>
        인증하기
      </p>
    );
  }
}

function AlienNoti(props) {
  const { alien, isPracticeDay } = props;

  if (alien.alien_status !== 0 || !isPracticeDay) {
    return <React.Fragment />;
  } else if (alien.practice_status === 1) {
    return (
      <div className={cx("notiRow", "notiRow--short")}>
        <p className={cx("notiText")}>오늘 확인 받아야 성장해요</p>
      </div>
    );
  } else if (alien.practice_status === 0) {
    return (
      <div className={cx("notiRow", "notiRow--short")}>
        <p className={cx("notiText", "notiText--highlight")}>
          오늘 인증 안 하면 죽어요
        </p>
      </div>
    );
  }
  return <React.Fragment />;
}

// function ToggleBtn(props) {
//   const { toggle, setToggle } = props;
//   return (
//     <div className={cx("ToggleBtn")} onClick={() => setToggle(!toggle)}>
//       <MdCancelPresentation size={"100%"} />
//     </div>
//   );
// }
