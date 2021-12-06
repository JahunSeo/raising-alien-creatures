import React from "react";
import styles from "./ChallengeItem.module.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { RiUser5Line, RiUser5Fill, RiUser3Line } from "react-icons/ri";
// import { BiUserPin } from 'react-icons/bi'
import { FaUserAlt, FaRegUser, FaMedal, FaFish } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { ImUser } from "react-icons/im";
import { BiMedal, BiLike } from "react-icons/bi";
// import { BsCalendar2Check, BsPatchCheck, BsFillStarFill } from 'react-icons/bs'
// import { GrAchievement } from 'react-icons/gr'
// import { IoFishOutline } from 'react-icons/io5'
// import { MdPerson } from 'react-icons/md'
// import { RiCalendarCheck } from 'react-icons/ri'
import { S3URL } from "../../../../shared/lib/Constants";

const PostItem = React.memo(function PostItem({ alien, handleSelectAlien }) {
  const { userId } = useSelector((state) => ({
    userId: state.user.user.id,
  }));

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
        <div
          className={styles.images}
          style={{
            backgroundImage: `url("${
              S3URL +
              alien.image_url.split("-")[0].split("/")[0] +
              "/M/" +
              alien.image_url.split("-")[0].split("/")[1]
            }")`,
          }}
        />
        <div className={styles.SubInfo}>
          <p>
            {" "}
            <FiUser size={20} /> {alien.user_nickname}
          </p>
          <p>
            <FaFish size={20} /> {alien.alien_name}
          </p>
          {/* <p>출생일 : {alien.created_date.split("T")[0]}</p> */}
          <p>
            <BiLike size={20} /> {alien.accumulated_count}번
          </p>
          <Link to={`/user/${alien.user_info_id}/room`}>
            <button className={styles.StyledButton}>참가자 어항</button>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default PostItem;
