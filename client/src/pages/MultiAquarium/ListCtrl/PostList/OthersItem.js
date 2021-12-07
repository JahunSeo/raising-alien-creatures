import React from "react";
import styles from "./ChallengeItem.module.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaFish } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { BiLike } from 'react-icons/bi'
import { GiSupersonicArrow } from "react-icons/gi";
import { DAY_TEXT } from "../../../../shared/lib/Constants";
import ProfileImage from './ProfileImage'

const OthersItem = React.memo(function PostItem({ alien, handleSelectAlien }) {
    const { userId } = useSelector((state) => ({
        userId: state.user.user.id,
    }));

    const todayValue = new Date().getDay();
    const isPracticeDay = !!alien[DAY_TEXT[todayValue].en]

    return (
        <div
            className={userId === alien.user_info_id
                ? styles.myPostItemBlock
                : styles.PostItemBlock
            }
            onClick={() => handleSelectAlien(alien.id)}
        >
            <h2>챌린지 : "{alien.challenge_name}"</h2>

            <div className={styles.Content}>
                <ProfileImage
                    image_url={alien.image_url}
                    practice_status={alien.practice_status}
                    isPracticeDay={isPracticeDay}
                />
                <div className={styles.SubInfo}>
                    <p> <FiUser size={20} />   {alien.user_nickname}</p>
                    <p><FaFish size={20} /> {alien.alien_name}</p>
                    {/* <p>출생일 : {alien.created_date.split("T")[0]}</p> */}
                    <p><BiLike size={20} /> {alien.accumulated_count}번</p>
                    <Link to={`/challenge/${alien.challenge_id}/room`}>
                        <button className={styles.StyledButton}> <GiSupersonicArrow />챌린지 어항</button>
                    </Link>
                </div>
            </div>
        </div>
    );
});

export default OthersItem;
