const ApprovalButton = () => {
  return (
    <div>
      <div class="mb-4">
        <button
          type="button"
          class="flex max-w-sm w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
        >
          <div class="flex sm:flex-cols-12 gap-4">
            <div class="col-span-1">
              <svg
                class="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
                />
              </svg>
            </div>
            <div class="col-span-2 pt-1.5">인증 수락</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ApprovalButton;
