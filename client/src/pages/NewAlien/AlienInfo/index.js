export default function DayCheckBox(setAlienName) {
  return (
    <>
      <div className=" w-1/2 px-3 sm:mt-40">
        <label
          className=" overflow-visible block uppercase tracking-wide text-gray-700 text-s font-bold mb-2"
          for="grid-first-name"
        >
          생명체 이름
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:ring-blue-400 focus:bg-white"
          id="grid-first-name"
          type="text"
          placeholder="정글특전대"
          onChange={(e) => {
            setAlienName(e.target.value);
          }}
        ></input>
      </div>
      <div className="container w-1/2 pl-3 py-6 font-bold text-gray-700">
        <div>챌린지 인증 요일를 선택해 주세요(총 x회) </div>
        <div class="bg-gray-800">
          <div class="w-full">
            <div class="flex ">
              <div class="m-auto flex flex-row gap-3">
                <div class="border-2 border-yellow-600 rounded-lg px-3 py-2 text-yellow-400 cursor-pointer hover:bg-yellow-600 hover:text-yellow-200">
                  일
                </div>

                <div class="border-2 border-blue-600 rounded-lg px-3 py-2 text-blue-400 cursor-pointer hover:bg-blue-600 hover:text-blue-200">
                  월
                </div>

                <div class="border-2 border-green-600 rounded-lg px-3 py-2 text-green-400 cursor-pointer hover:bg-green-600 hover:text-green-200">
                  화
                </div>

                <div class="border-2 border-purple-600 rounded-lg px-3 py-2 text-purple-400 cursor-pointer hover:bg-purple-600 hover:text-purple-200">
                  수
                </div>

                <div class="border-2 border-red-600 rounded-lg px-3 py-2 text-red-400 cursor-pointer hover:bg-red-600 hover:text-red-200">
                  목
                </div>

                <div class="border-2 border-gray-800 rounded-lg px-3 py-2 text-gray-400 cursor-pointer hover:bg-gray-800 hover:text-gray-200">
                  금
                </div>
                <div class="border-2 border-indigo-600 rounded-lg px-3 py-2 text-indigo-400 cursor-pointer hover:bg-indigo-800 hover:text-indigo-200">
                  토
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
