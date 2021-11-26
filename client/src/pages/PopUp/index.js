export default function PopUp() {
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
            <button>
              <i className="fa fa-times-circle text-red-500 hover:text-red-600 text-xl"></i>
            </button>
          </div>
        </div>
        <div className="px-10 py-14 text-gray-600 text-lg flex justify-center">
          생명체가 생성되었습니다 !
        </div>

        <div className="px-5 py-4 flex justify-end">
          {/* <button className=" text-white rounded-lg py-2 px-3 bg-indigo-600 hover:bg-indigo-700 transition duration-150">
              확인
            </button> */}
        </div>
      </div>
    </>
  );
}
