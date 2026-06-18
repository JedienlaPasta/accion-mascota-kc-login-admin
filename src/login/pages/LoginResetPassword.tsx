import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Footer from "../components/Footer";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { url, realm, auth, messagesPerField, message } = kcContext;
    const { msg, msgStr } = i18n;

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex flex-1 items-center justify-around relative font-geist">
                <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
                    <div className="w-full max-w-md space-y-6">
                        {/* Cabecera y Logo */}
                        <div className="mb-8 space-y-2.5 text-center">
                            <img
                                src="/mascota_icon.png"
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

                        {/* Tarjeta de Recuperación */}
                        <div className="flex flex-col gap-6 rounded-xl py-2 text-gray-600">
                            <span className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-8">
                                <h3 className="font-semibold text-gray-800">{msg("emailForgotTitle")}</h3>
                                <p className="text-sm">
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(
                                                realm.duplicateEmailsAllowed ? msgStr("emailInstructionUsername") : msgStr("emailInstruction")
                                            )
                                        }}
                                    />
                                </p>
                            </span>

                            <div className="px-6">
                                <form action={url.loginAction} method="post" className="space-y-4">
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="username"
                                            className="ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase"
                                        >
                                            {!realm.loginWithEmailAllowed
                                                ? msg("username")
                                                : !realm.registrationEmailAsUsername
                                                  ? msg("usernameOrEmail")
                                                  : msg("email")}
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:ring-2 ${
                                                messagesPerField.existsError("username")
                                                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                    : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                            }`}
                                            autoFocus
                                            defaultValue={auth?.attemptedUsername ?? ""}
                                            aria-invalid={messagesPerField.existsError("username")}
                                        />
                                        {messagesPerField.existsError("username") && (
                                            <span
                                                className="text-rose-500 text-xs font-medium ml-1 block mt-3"
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("username")) }}
                                            />
                                        )}
                                    </div>

                                    <div className="pt-1">
                                        <button
                                            type="submit"
                                            className="flex h-12 w-full justify-center gap-2 cursor-pointer items-center rounded-xl bg-emerald-800/90 px-7 text-white shadow-emerald-950/30 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => setIsButtonDisabled(true)}
                                            disabled={isButtonDisabled}
                                        >
                                            {msgStr("doSubmit")}
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-muted-foreground text-sm">
                                        <a
                                            href={url.loginUrl}
                                            className="text-emerald-800 font-medium hover:underline flex items-center justify-center gap-1"
                                        >
                                            {msg("backToLogin")}
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Alerta Global */}
                            {message !== undefined && message.type !== "warning" && !messagesPerField.existsError("username") && (
                                <div
                                    className={`mx-6 mb-4 rounded-xl p-4 text-sm font-medium ${
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
