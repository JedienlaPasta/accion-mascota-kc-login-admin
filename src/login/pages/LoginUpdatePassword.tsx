import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Footer from "../components/Footer";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { url, messagesPerField, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex flex-1 items-center justify-around relative font-outfit">
                <div className="flex items-center justify-center px-4 py-12">
                    <div className="max-w-md space-y-6">
                        {/* Cabecera */}
                        <div className="mb-4 space-y-2.5 text-center">
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
                            <h1 className="text-gray-800 text-2xl font-extrabold">{msg("updatePasswordTitle")}</h1>
                            <p className="text-sm text-gray-600">Por favor, ingresa tu nueva contraseña.</p>
                        </div>

                        {/* Tarjeta del Formulario */}
                        <div className="flex flex-col gap-6 rounded-xl py-2 text-gray-600">
                            <div className="px-6s">
                                <form
                                    id="kc-passwd-update-form"
                                    action={url.loginAction}
                                    method="post"
                                    className="space-y-4"
                                    onSubmit={() => setIsLoading(true)}
                                >
                                    {/* 1. Nueva Contraseña */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="password-new"
                                            className="ml-1 mb-0.5 flex justify-between text-[10px] font-bold text-slate-500 uppercase"
                                        >
                                            {msg("passwordNew")}
                                        </label>
                                        <input
                                            id="password-new"
                                            name="password-new"
                                            type="password"
                                            autoFocus
                                            autoComplete="new-password"
                                            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm shadow-gray-200/80 transition-all outline-none focus-within:ring-2 ${
                                                messagesPerField.existsError("password", "password-confirm")
                                                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                    : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                            }`}
                                        />
                                    </div>

                                    {/* 2. Confirmar Contraseña */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="password-confirm"
                                            className="ml-1 mb-0.5 flex justify-between text-[10px] font-bold text-slate-500 uppercase"
                                        >
                                            {msg("passwordConfirm")}
                                        </label>
                                        <input
                                            id="password-confirm"
                                            name="password-confirm"
                                            type="password"
                                            autoComplete="new-password"
                                            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm shadow-gray-200/80 transition-all outline-none focus-within:ring-2 ${
                                                messagesPerField.existsError("password-confirm")
                                                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                    : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                            }`}
                                        />

                                        {/* Errores */}
                                        {messagesPerField.existsError("password", "password-confirm") && (
                                            <span
                                                className="text-rose-500 text-xs font-medium ml-1 block mt-1"
                                                dangerouslySetInnerHTML={{
                                                    __html: kcSanitize(messagesPerField.getFirstError("password", "password-confirm"))
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* 3. Checkbox "Cerrar sesión en otros dispositivos" */}
                                    {isAppInitiatedAction && (
                                        <div className="flex items-center gap-2 pt-2">
                                            <input
                                                type="checkbox"
                                                id="logout-sessions"
                                                name="logout-sessions"
                                                value="on"
                                                defaultChecked={true}
                                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                            />
                                            <label htmlFor="logout-sessions" className="text-xs font-medium text-slate-700 cursor-pointer">
                                                {msg("logoutOtherSessions")}
                                            </label>
                                        </div>
                                    )}

                                    {/* Botones de Acción */}
                                    <div className="pt-4 flex flex-col gap-3">
                                        <button
                                            disabled={isLoading}
                                            type="submit"
                                            className={`group relative flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl font-semibold text-white shadow-lg shadow-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                isLoading ? "bg-emerald-900/50" : "bg-emerald-800/90 hover:bg-emerald-700"
                                            }`}
                                        >
                                            {!isLoading && (
                                                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-600 via-emerald-700 to-emerald-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            )}
                                            <div className="relative z-10 flex items-center justify-center gap-2">
                                                {isLoading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="size-5 animate-spin rounded-full border-4 border-white/80 border-t-emerald-800/60" />
                                                        <span className="ml-2">Actualizando...</span>
                                                    </div>
                                                ) : (
                                                    msgStr("doSubmit")
                                                )}
                                            </div>
                                        </button>

                                        {/* Botón de Cancelar (solo si el flujo lo permite) */}
                                        {isAppInitiatedAction && (
                                            <button
                                                type="submit"
                                                name="cancel-aia"
                                                value="true"
                                                className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                                            >
                                                {msgStr("doCancel")}
                                            </button>
                                        )}
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
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
