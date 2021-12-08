import { Link, useMatch } from "react-router-dom";
// import { RiMailCheckLine, RiMailCheckFill } from "react-icons/ri";
// import { RiFileList3Line, RiFileList3Fill } from 'react-icons/ri'
import { MdOutlineFactCheck, MdFactCheck } from 'react-icons/md'
import styles from "../index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function ApproveBtn(props) {
  const { user, switchSignInModal } = props;
  const approvalMatch = useMatch("/approval");

  let selected = !!approvalMatch;
  let Icon;
  if (selected) Icon = MdFactCheck;
  else Icon = MdOutlineFactCheck;

  if (!user.login) {
    return (
      <p className={cx("MenuBtn")} onClick={() => switchSignInModal()}>
        <Icon size={33} />
      </p>
    );
  } else {
    return (
      <Link
        to={`/approval`}
        className={cx("MenuBtn", selected && "MenuBtn--selected")}
      >
        <Icon size={33} />
      </Link>
    );
  }
}
