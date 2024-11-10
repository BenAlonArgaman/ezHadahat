// Navbar.tsx
import { UserButton } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";

export const Navbar = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-4 justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <div className="relative w-[72px] h-[72px] transform hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <MainNav />
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger className="hover:bg-accent p-2 rounded-full transition">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="h-full bg-white">
                  <div className="p-6">
                    <div className="font-bold text-xl text-primary mb-6">
                      LOGO
                    </div>
                    <MainNav className="flex-col space-y-5" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* UserButton */}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
