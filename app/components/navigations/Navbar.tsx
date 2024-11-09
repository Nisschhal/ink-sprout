import { Logo } from "./Logo";

export default async function NavBar() {
  return (
    <header className="bg-slate-500 py-5">
      <nav>
        <ul className="flex justify-between gap-3">
          <li className="w-max-2xl overflow-hidden">
            <Logo />
          </li>
          <li className="ml-auto">Home</li>
          <li>About</li>
        </ul>
      </nav>
    </header>
  );
}
