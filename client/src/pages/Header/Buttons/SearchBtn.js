import { Link, useMatch } from "react-router-dom";
// import { RiSearchEyeLine, RiSearchEyeFill } from "react-icons/ri";
import { HiOutlineHome, HiHome } from 'react-icons/hi'


import styles from "../index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function SearchBtn(props) {
  const mainMatch = useMatch("/");

  let selected = !!mainMatch;
  let Icon;
  if (selected) Icon = HiHome;
  else Icon = HiOutlineHome;
  //   if (!mainMatch) Icon = RiSearch2Line;
  //   else Icon = RiSearch2Fill;

  return (
    <Link to={"/"} className={cx("MenuBtn", selected && "MenuBtn--selected")}>
      <Icon />
    </Link>
  );
}
