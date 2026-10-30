import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F7F0D4] dark:bg-[#141210]">
      <div className="p-8 bg-[#FFFDF5] dark:bg-[#1E1A16] border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_#000] text-center font-mono">
        <h1 className="text-4xl font-black mb-2">404 // NOT FOUND</h1>
        <p className="text-sm mb-6">Halaman yang dicari tidak ditemukan.</p>
        <Link
          href="/"
          className="px-4 py-2 bg-[#EBB956] text-black font-black uppercase border-2 border-black"
        >
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
