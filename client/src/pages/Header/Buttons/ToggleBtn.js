import styles from "../index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function ToggleBtn(props) {
  const { isMenuOn, setIsMenuOn } = props;
  return (
    <nav className={styles.toggleBtn}>
      <button
        className="text-gray-500 w-10 h-10 relative focus:outline-none bg-transparent"
        onClick={() => setIsMenuOn(!isMenuOn)}
      >
        <div className="block w-5 absolute left-1/2 top-1/2   transform  -translate-x-1/2 -translate-y-1/2">
          <span
            aria-hidden="true"
            className={cx(
              "block absolute h-0.5 w-5 bg-white transform transition duration-500 ease-in-out",
              isMenuOn ? "rotate-45" : "-translate-y-1.5"
            )}
          ></span>
          <span
            aria-hidden="true"
            className={cx(
              "block absolute h-0.5 w-5 bg-white transform transition duration-500 ease-in-out",
              isMenuOn ? "opacity-0" : ""
            )}
          ></span>
          <span
            aria-hidden="true"
            className={cx(
              "block absolute h-0.5 w-5 bg-white transform transition duration-500 ease-in-out",
              isMenuOn ? "-rotate-45" : "translate-y-1.5"
            )}
          ></span>
        </div>
      </button>
    </nav>
  );
}
