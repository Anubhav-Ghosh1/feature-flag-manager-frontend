import { useRouter } from "next/navigation";
import React from "react";

export default function Footer() {
  let router = useRouter();
  return (
    <footer className="mt-36 bg-gray-800 w-full py-8">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto px-4">
        <p
          onClick={() => router.push("/docs")}
          className="text-gray-300 cursor-pointer hover:text-white mb-4 md:mb-0"
        >
          Documentation
        </p>
        <div>
          <p className="text-center cursor-default text-white">
            © 2025 Feature Manager. All rights reserved.
          </p>
        </div>
        <div className="flex space-x-6">
          <a
            href="https://github.com/your-org/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white"
            aria-label="GitHub"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 012.9-.39c.98.01 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
            </svg>
          </a>
          <a
            href="https://twitter.com/your-handle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white"
            aria-label="Twitter"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.56c-.89.39-1.84.65-2.84.77a4.93 4.93 0 002.16-2.72 9.86 9.86 0 01-3.13 1.2A4.92 4.92 0 0016.62 3c-2.73 0-4.94 2.21-4.94 4.93 0 .39.04.77.12 1.13C7.69 8.87 4.07 6.92 1.64 3.91c-.43.74-.67 1.6-.67 2.52 0 1.74.89 3.28 2.25 4.18a4.93 4.93 0 01-2.24-.62v.06c0 2.43 1.73 4.46 4.03 4.92-.42.11-.87.17-1.33.17-.32 0-.63-.03-.93-.09.63 1.97 2.45 3.4 4.6 3.44A9.87 9.87 0 010 21.54a13.94 13.94 0 007.56 2.22c9.06 0 14.02-7.51 14.02-14.02 0-.21 0-.42-.02-.63A10.06 10.06 0 0024 4.56z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
