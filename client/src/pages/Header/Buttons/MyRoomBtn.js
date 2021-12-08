import { Link, useMatch } from "react-router-dom";
import { HiOutlineHome, HiHome } from 'react-icons/hi'
// import { RiUser5Line, RiUser5Fill } from "react-icons/ri";

import styles from "../index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function MyRoomBtn(props) {
  const { user, switchSignInModal } = props;
  const userMatch = useMatch("/user/:userId/room");

  let selected = userMatch && user.id === Number(userMatch.params.userId);
  let Icon;
  if (selected) Icon = HiHome;
  else Icon = HiOutlineHome;

  if (!user.login) {
    return (
      <p className={cx("MenuBtn")} onClick={() => switchSignInModal()}>
        <Icon />
      </p>
    );
  } else {
    return (
      <Link
        to={`/user/${user.id}/room`}
        className={cx("MenuBtn", !!selected && "MenuBtn--selected")}
      >
        <Icon />
      </Link>
    );
  }
}
