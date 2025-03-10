"use client";

import { LoginUserInput, LoginUserSchema } from "@/lib/validations/user.schema";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { apiLoginUser } from "@/lib/api-requests";
import FormInput from "@/components/FormInput";
import Link from "next/link";
import { LoadingButton } from "@/components/LoadingButton";
import useStore from "@/store";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const store = useStore();
    const router = useRouter();

    const methods = useForm<LoginUserInput>({
        resolver: zodResolver(LoginUserSchema),
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitSuccessful },
    } = methods;

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    async function LoginUserFunction(credentials: LoginUserInput) {
        store.setRequestLoading(true);
        try {
            const res = await apiLoginUser(JSON.stringify(credentials));

            if (res.success) {
                toast.success(res.message);
                store.setAuthUser(res?.data?.user);
                return router.push("/profile");
            }
        } catch (error: unknown) {
            toast.error(error as string);

        } finally {
            store.setRequestLoading(false);
        }
    }

    const onSubmitHandler: SubmitHandler<LoginUserInput> = (values) => {
        LoginUserFunction(values);
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmitHandler)}
                className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
            >
                <FormInput label="Email" name="email" type="email" />
                <FormInput label="Password" name="password" type="password" />

                {/* <div className="text-right">
                    <Link href="#" className="">
                        Forgot Password?
                    </Link>
                </div> */}
                <LoadingButton
                    loading={store.requestLoading}
                    textColor="text-ct-blue-600"
                >
                    Login
                </LoadingButton>
                <span className="block">
                    Need an account?{" "}
                    <Link href="/register" className="text-ct-blue-600">
                        Sign Up Here
                    </Link>
                </span>
            </form>
        </FormProvider>
    );
}
