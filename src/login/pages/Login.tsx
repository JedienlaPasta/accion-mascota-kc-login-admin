import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import Footer from "../components/Footer";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { url, login, realm, messagesPerField, message } = kcContext;
    const { msg, msgStr } = i18n;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className=" flex flex-1 items-center justify-around  relative font-geist">
                <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
                    <div className="w-full max-w-md space-y-6">
                        <div className="mb-8 space-y-2.5 text-center">
                            <img
                                src={`${import.meta.env.BASE_URL}mascota_icon.png`}
                                alt="Logo Acción Mascota"
                                width={200}
                                height={32}
                                className="-mt-2 h-20 w-30 place-self-center object-cover"
                            />
                            <p className="mx-auto inline-flex items-center rounded-full bg-emerald-50 px-4 py-1 text-[11px] font-semibold tracking-[0.18em] text-emerald-800 uppercase">
                                Portal ciudadano · Tenencia responsable
                            </p>
                            <h1 className="text-gray-800 text-2xl font-bold">Portal Acción Mascota</h1>
                        </div>

                        {/* Login Card */}
                        <div className="flex flex-col gap-6 rounded-xl py-2 text-gray-600">
                            {/* Form Header */}
                            <span className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-8">
                                <h3 className="font-semibold text-gray-800">Iniciar Sesión</h3>
                                <p className="text-sm">Ingresa tus credenciales para acceder a tu cuenta</p>
                            </span>

                            {/* Form Content */}
                            <div className="px-6">
                                <form action={url.loginAction} method="post" className="space-y-4">
                                    <div className="space-y-4">
                                        <label className="ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                            {!realm.loginWithEmailAllowed
                                                ? msg("username")
                                                : !realm.registrationEmailAsUsername
                                                  ? msg("usernameOrEmail")
                                                  : msg("email")}
                                        </label>
                                        <input
                                            name="username"
                                            defaultValue={login.username ?? ""}
                                            type="text"
                                            autoFocus
                                            autoComplete="username"
                                            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:ring-2 ${
                                                messagesPerField.existsError("username", "password")
                                                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                    : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                            }`}
                                        />

                                        <label className="ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                            <span>{msg("password")}</span>
                                            {realm.resetPasswordAllowed && (
                                                <a href={url.loginResetCredentialsUrl} className="text-emerald-800 text-[10px] hover:underline">
                                                    {msg("doForgotPassword")}
                                                </a>
                                            )}
                                        </label>
                                        <input
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:ring-2 ${
                                                messagesPerField.existsError("username", "password")
                                                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                    : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                            }`}
                                        />
                                    </div>

                                    {messagesPerField.existsError("username", "password") && (
                                        <div className="text-rose-500 text-xs font-medium ml-1">
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: kcSanitize(kcContext.messagesPerField.getFirstError("username", "password"))
                                                }}
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="flex h-12 w-full justify-center gap-2 cursor-pointer items-center rounded-xl bg-emerald-800/90 px-7 text-white shadow-emerald-950/30 transition-shadow duration-300 hover:shadow-lg"
                                        onClick={() => setIsLoginButtonDisabled(true)}
                                        disabled={isLoginButtonDisabled}
                                    >
                                        {msgStr("doLogIn")}
                                    </button>
                                </form>

                                {realm.registrationAllowed && (
                                    <div className="mt-6 text-center">
                                        <p className="text-muted-foreground text-sm">
                                            ¿No tienes cuenta?{" "}
                                            <a href={url.registrationUrl} className="text-emerald-800 font-medium hover:underline">
                                                Regístrate aquí
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </div>
                            {/* Global Alert Message */}
                            {message !== undefined && message.type !== "warning" && !messagesPerField.existsError("username", "password") && (
                                <div
                                    className={`rounded-xl p-4 text-sm font-medium ${
                                        message.type === "error"
                                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                                            : message.type === "success"
                                              ? "bg-green-50 text-green-800 border border-green-200"
                                              : message.type === "info"
                                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                                : ""
                                    }`}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
