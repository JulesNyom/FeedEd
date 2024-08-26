import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center gap-4 p-5 text-center">
        <Link href="/">
          <Image
            src="/assets/images/feeded.png"
            alt="logo"
            width={128}
            height={38}
          />
        </Link>

        <p className="text-xs">2024 FeedEd. All Rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
