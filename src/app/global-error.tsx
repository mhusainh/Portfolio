"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="p-8 font-mono bg-[#F7F0D4] text-[#141210]">
        <h2 className="text-xl font-bold">Terjadi Kesalahan Sistem</h2>
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-[#EBB956] border-2 border-black font-bold"
        >
          Coba Lagi
        </button>
      </body>
    </html>
  );
}
