import Link from 'next/link';

export default function CouponNotFound() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            쿠폰을 찾을 수 없습니다
          </h1>
          <p className="text-slate-500 mb-6">
            유효하지 않은 쿠폰 URL입니다.<br />
            URL을 다시 확인해 주세요.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            관리 페이지로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
