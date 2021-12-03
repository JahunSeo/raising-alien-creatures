import { Link } from "react-router-dom";
import styles from "../index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function SearchBtn(props) {
  return (
    <Link to={"/"} className={cx("MenuBtn")}>
      {"검색"}
    </Link>
  );
}
