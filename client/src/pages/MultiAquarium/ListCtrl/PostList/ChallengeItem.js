import React from "react";
import styles from "./ChallengeItem.module.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaFish } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { BiLike } from 'react-icons/bi'
import { RiUser5Fill } from "react-icons/ri";
import ProfileImage from './ProfileImage'
import { DAY_TEXT } from "../../../../shared/lib/Constants";

const ChallengeItem = React.memo(function ChallengeItem({ alien, handleSelectAlien }) {
  const { userId } = useSelector((state) => ({
    userId: state.user.user.id,
  }));

  const todayValue = new Date().getDay();
  const isPracticeDay = !!alien[DAY_TEXT[todayValue].en]

  return (
    <div
      className={
        userId === alien.user_info_id
          ? styles.myPostItemBlock
          : styles.PostItemBlock
      }
      onClick={() => handleSelectAlien(alien.id)}
    >
      <div className={userId === alien.user_info_id ? null : styles.line} />
      <div className={styles.Content}>
        <ProfileImage
          image_url={alien.image_url}
          alien_status={alien.alien_status}
          practice_status={alien.practice_status}
          isPracticeDay={isPracticeDay}
        />
        <div className={styles.SubInfo}>
          <p> <FiUser size={20} />   {alien.user_nickname}</p>
          <p> <FaFish size={20} /> {alien.alien_name}</p>
          <p><BiLike size={20} /> {alien.accumulated_count}번</p>
          <Link to={`/user/${alien.user_info_id}/room`}>
            <button className={styles.StyledButton}> <RiUser5Fill />참가자 어항</button>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default ChallengeItem;
