import styles from "./PersonalItem.module.css";
import { S3URL } from "../../../../shared/lib/Constants";
import BubbleW from '../../../../image/bubble-512px.png'
import BubbleR from '../../../../image/bubble-512px-red.png'


function ProfileImage(props) {
    const { image_url, alien_status, practice_status, isPracticeDay } = props;
    if (isPracticeDay && alien_status === 0 && practice_status === 0) {
        return (
            <div
                className={styles.todo_images}
                style={{
                    backgroundImage: (
                        `url(${BubbleR}),
                        url(${S3URL + image_url.split("-")[0].split("/")[0] +
                        '/M/' + image_url.split("-")[0].split("/")[1]})`
                    ),
                }}
            />
        )
    }
    else if (isPracticeDay && alien_status === 0 && practice_status === 1) {
        return (
            <div
                className={styles.todo_images}
                style={{
                    backgroundImage: (
                        `url(${BubbleW}),
                        url(${S3URL + image_url.split("-")[0].split("/")[0] +
                        '/M/' + image_url.split("-")[0].split("/")[1]})`
                    ),
                }}
            />
        )
    }
    else {
        return (
            <div
                className={styles.orig_images}
                style={{
                    backgroundImage: `url("${S3URL + image_url.split("-")[0].split("/")[0] +
                        '/M/' + image_url.split("-")[0].split("/")[1]}")`,
                }}
            />
        )
    }
}

export default ProfileImage;