import { useEffect } from "react";
// import { apiGetAuthUser } from "./api-requests";
import useStore from "@/store";

export default function useSession() {
  const store = useStore();

  async function fetchUser() {
    try {
      // const user = await apiGetAuthUser();

      // console.log("Inside useSession user====>>>>", user)
      // store.setAuthUser(user);
    } catch (error) {
      store.reset();
    }
  }

  useEffect(() => {
    if (!store.authUser) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return store.authUser;
}
