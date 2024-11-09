import Link from "next/link";
import { Button } from "../ui/button";

type BackButtonProps = {
  href: string;
  label: string;
};
export default function BackButton({ href, label }: BackButtonProps) {
  return (
    <Button className="font-medium w-full">
      <Link href={href} aria-label={label}>
        {label}
      </Link>
    </Button>
  );
}
