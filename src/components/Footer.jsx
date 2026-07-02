export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-4 mt-10">

      <div className="text-center">

        <p className="text-sm">

          © {new Date().getFullYear()} Library Management System

        </p>

        <p className="text-xs text-gray-400 mt-1">

          Developed by Salmo Bashir

        </p>

      </div>

    </footer>
  );
}