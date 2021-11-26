import { useDispatch } from "react-redux";
import * as actions from "../../Redux/actions";

export default function PopUp({ popupModal, popupMessage }) {
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (popupModal) {
      dispatch(actions.setPopupModal(null, ""));
      // } else {
      //   dispatch(
      //     actions.setPopupModal("CREATE_ALIEN", "생명체가 생성되었습니다 !")
      //   );
      // console.log(3333, popupModal);
    }
  };
  return (
    <>
      <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
        integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
        crossorigin="anonymous"
      />
      <div className="absolute bg-gray-500 w-full h-full flex justify-center opacity-50 z-10" />
      <div className="absolute md:w-1/3 rounded-lg shadow-lg bg-white my-3 z-10">
        <div className="rounded-t-lg flex justify-between border-b bg-indigo-200 border-gray-100 px-5 py-4">
          <div>
            <i className="fas fa-exclamation-circle text-indigo-600 text-xl"></i>
            <span className="font-bold text-gray-700 text-xl px-2">
              {" "}
              Success
            </span>
          </div>
          <div className="flex items-center">
            <button onClick={handleSubmit}>
              <i className="fa fa-times-circle text-red-500 hover:text-red-600 text-xl"></i>
            </button>
          </div>
        </div>
        <div className="px-10 py-14 text-gray-600 text-lg flex justify-center">
          {popupMessage}
        </div>
      </div>
    </>
  );
}
