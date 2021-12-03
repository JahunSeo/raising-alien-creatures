import { Link, useMatch } from "react-router-dom";
import { RiSearchEyeLine, RiSearchEyeFill } from "react-icons/ri";
// import { RiSearch2Line, RiSearch2Fill } from "react-icons/ri";

import styles from "../index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function SearchBtn(props) {
  const mainMatch = useMatch("/");

  let selected = !!mainMatch;
  let Icon;
  if (selected) Icon = RiSearchEyeFill;
  else Icon = RiSearchEyeLine;
  //   if (!mainMatch) Icon = RiSearch2Line;
  //   else Icon = RiSearch2Fill;

  return (
    <Link to={"/"} className={cx("MenuBtn", selected && "MenuBtn--selected")}>
      <Icon />
    </Link>
  );
}
