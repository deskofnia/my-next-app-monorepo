import Header from "@/components/Header";
import { apiGetAuthUser } from "@/lib/api-requests";
import { AuthPageInvisible } from "@/lib/protect-page";
import { cookies } from "next/headers";

export default async function ProfilePage() {
    const allCookies = cookies();
    const token = allCookies.get("token")?.value;

    const user = await apiGetAuthUser(token)

    return (
        <>
            <Header />
            <section className="bg-ct-blue-600  min-h-screen pt-20">
                <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
                    <div>
                        <p className="mb-3 text-5xl text-center font-semibold">
                            Profile Page
                        </p>
                        <div className="mt-8">
                            <p className="mb-3">Id: {user?.id}</p>
                            <p className="mb-3">Name: {user?.name}</p>
                            <p className="mb-3">Email: {user?.email}</p>
                            <p className="mb-3">Role: {user?.role}</p>
                            <p className="mb-3">Verified: {String(user?.verified)}</p>
                        </div>
                    </div>
                </div>
            </section>
            <AuthPageInvisible />
        </>
    );
}