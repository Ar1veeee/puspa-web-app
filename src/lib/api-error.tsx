import React from "react";
import toast from "react-hot-toast";

/**
 * Parsing error dari API dan menampilkannya menggunakan react-hot-toast.
 * Mendukung format error validasi bersarang (nested validation errors).
 */
export function handleApiError(error: any, defaultMessage = "Terjadi kesalahan") {
  let mainMessage = defaultMessage;
  let validationErrors: string[] = [];

  if (error?.response?.data) {
    const data = error.response.data;
    
    // Gunakan pesan error dari API jika ada
    if (data.message) {
      mainMessage = data.message;
    }
    
    // Jika ada nested errors (errors: { field: [msg1, msg2] })
    if (data.errors && typeof data.errors === "object") {
      Object.keys(data.errors).forEach((key) => {
        const fieldErrors = data.errors[key];
        if (Array.isArray(fieldErrors)) {
          validationErrors.push(...fieldErrors);
        } else if (typeof fieldErrors === "string") {
          validationErrors.push(fieldErrors);
        }
      });
    }
  } else if (error?.message) {
    mainMessage = error.message;
  }

  // Tampilkan Toast error yang cantik
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-in fade-in duration-300" : "animate-out fade-out duration-300"
        } max-w-md w-full bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-lg pointer-events-auto flex items-start justify-between p-4 relative transition-all`}
        style={{
          boxShadow: "0 10px 30px -5px rgba(239, 68, 68, 0.2), 0 8px 16px -6px rgba(239, 68, 68, 0.1)",
        }}
      >
        {/* Left icon & text */}
        <div className="flex gap-3 items-start flex-1 pr-6">
          {/* Custom Red Error Icon */}
          <div className="bg-red-500 text-white rounded-full p-1.5 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>

          <div className="flex flex-col text-sm text-left">
            <div className="font-extrabold text-red-900 text-base">{mainMessage}</div>
            {validationErrors.length > 0 && (
              <ul className="list-disc pl-4 text-xs text-red-800 space-y-1 mt-1.5 font-medium">
                {validationErrors.map((err, idx) => (
                  <li key={idx} className="leading-snug">{err}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-red-500 hover:text-red-800 hover:bg-red-100 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 absolute top-2.5 right-2.5 focus:outline-none"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    ),
    {
      duration: 10000, // 10 detik agar user sempat membaca, namun bisa langsung ditutup
      id: "api-error-toast", // Mencegah duplikasi toast yang identik bertumpuk
    }
  );

  return mainMessage;
}

/**
 * Menampilkan toast sukses secara global
 */
export function showSuccessToast(message: string) {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-in fade-in duration-300" : "animate-out fade-out duration-300"
        } max-w-md w-full bg-teal-50 border-l-4 border-teal-500 rounded-r-xl shadow-lg pointer-events-auto flex items-start justify-between p-4 relative transition-all`}
        style={{
          boxShadow: "0 10px 30px -5px rgba(20, 184, 166, 0.2), 0 8px 16px -6px rgba(20, 184, 166, 0.1)",
        }}
      >
        {/* Left icon & text */}
        <div className="flex gap-3 items-start flex-1 pr-6">
          {/* Custom Teal Success Icon */}
          <div className="bg-teal-500 text-white rounded-full p-1.5 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <div className="flex flex-col text-sm text-left">
            <div className="font-extrabold text-teal-900 text-base">{message}</div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-teal-600 hover:text-teal-900 hover:bg-teal-100 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 absolute top-2.5 right-2.5 focus:outline-none"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    ),
    {
      duration: 5000,
    }
  );
}
