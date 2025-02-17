"use client";

import Spinner from "./Spinner";
import Link from "next/link";
import useStore from "@/store";
import { useRouter } from "next/navigation";
import { apiLogoutUser } from "@/lib/api-requests";

const Header = () => {
  const store = useStore();
  const router = useRouter();

  const user = store.authUser;

  console.log("user====", user);

  const handleLogout = async () => {
    console.log("inside handle logout ===>>>>>");
    store.setRequestLoading(true);
    try {
      await apiLogoutUser();
    } catch (error) {
    } finally {
      store.reset();
      router.push("/login");
    }
  };

  return (
    <>
      <header className="bg-white h-20">
        <nav className="h-full flex justify-between container items-center">
          <div>
            <Link href="/" className="text-black text-2xl font-semibold">
              Demo Project
            </Link>
          </div>
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/" className="text-black">
                Home
              </Link>
            </li>
            {!user && (
              <>
                <li>
                  <Link href="/register" className="text-black">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-black">
                    Login
                  </Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li>
                  <Link href="/profile" className="text-black">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/todo" className="text-black">
                    To Do
                  </Link>
                </li>
                <li className="text-black cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <div className="pt-4 pl-2 bg-ct-blue-600 fixed">
        {store.requestLoading && <Spinner color="text-ct-yellow-600" />}
      </div>
    </>
  );
};

export default Header;
