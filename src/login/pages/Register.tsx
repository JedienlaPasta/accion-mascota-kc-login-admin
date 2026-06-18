import { useState, useLayoutEffect } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Footer from "../components/Footer";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>;

export default function Register(props: RegisterProps) {
    const { kcContext, i18n } = props;
    const {
        url,
        messagesPerField,
        recaptchaRequired,
        recaptchaVisible,
        recaptchaSiteKey,
        recaptchaAction,
        termsAcceptanceRequired,
        message,
        realm,
        passwordRequired
    } = kcContext;
    const { msg, msgStr } = i18n;

    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    // Lógica vital de Keycloak para el Recaptcha
    useLayoutEffect(() => {
        (window as any)["onSubmitRecaptcha"] = () => {
            // @ts-expect-error
            document.getElementById("kc-register-form").requestSubmit();
        };
        return () => {
            delete (window as any)["onSubmitRecaptcha"];
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex flex-1 items-center justify-around relative font-geist">
                <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
                    <div className="w-full max-w-md space-y-6">
                        {/* Cabecera y Logo idénticos al Login */}
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

                        {/* Tarjeta de Registro */}
                        <div className="flex flex-col gap-6 rounded-xl py-2 text-gray-600">
                            <span className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-8">
                                <h3 className="font-semibold text-gray-800">Crear Cuenta</h3>
                                <p className="text-sm">Completa tus datos para registrarte en la plataforma</p>
                            </span>

                            <div className="px-6">
                                <form id="kc-register-form" action={url.registrationAction} method="post" className="space-y-4">
                                    {/* 1. Nombre */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="firstName"
                                            className="ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                        >
                                            {msg("firstName")}
                                            <span className="text-sm absolute right-1">*</span>
                                        </label>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            defaultValue={""}
                                            type="text"
                                            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:ring-2 ${
                                                messagesPerField.existsError("firstName")
                                                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                    : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                            }`}
                                        />
                                        {messagesPerField.existsError("firstName") && (
                                            <span
                                                className="text-rose-500 text-xs font-medium ml-1 block mt-1"
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("firstName")) }}
                                            />
                                        )}
                                    </div>

                                    {/* 2. Apellido */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="lastName"
                                            className="ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                        >
                                            {msg("lastName")}
                                            <span className="text-sm absolute right-1">*</span>
                                        </label>
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            defaultValue={""}
                                            type="text"
                                            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:ring-2 ${
                                                messagesPerField.existsError("lastName")
                                                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                    : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                            }`}
                                        />
                                        {messagesPerField.existsError("lastName") && (
                                            <span
                                                className="text-rose-500 text-xs font-medium ml-1 block mt-1"
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("lastName")) }}
                                            />
                                        )}
                                    </div>

                                    {/* 3. Email */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="email"
                                            className="ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                        >
                                            {msg("email")}
                                            <span className="text-sm absolute right-1">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            defaultValue={""}
                                            type="email"
                                            autoComplete="email"
                                            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:ring-2 ${
                                                messagesPerField.existsError("email")
                                                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                    : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                            }`}
                                        />
                                        {messagesPerField.existsError("email") && (
                                            <span
                                                className="text-rose-500 text-xs font-medium ml-1 block mt-1"
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("email")) }}
                                            />
                                        )}
                                    </div>

                                    {/* 4. Username (Solo si el panel de control NO obliga a usar el email como usuario) */}
                                    {!realm.registrationEmailAsUsername && (
                                        <div className="space-y-1">
                                            <label
                                                htmlFor="username"
                                                className="ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                            >
                                                {msg("username")}
                                                <span className="text-sm absolute right-1">*</span>
                                            </label>
                                            <input
                                                id="username"
                                                name="username"
                                                defaultValue={""}
                                                type="text"
                                                autoComplete="username"
                                                className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:ring-2 ${
                                                    messagesPerField.existsError("username")
                                                        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                        : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                                }`}
                                            />
                                            {messagesPerField.existsError("username") && (
                                                <span
                                                    className="text-rose-500 text-xs font-medium ml-1 block mt-1"
                                                    dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("username")) }}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* 5. Contraseñas */}
                                    {passwordRequired && (
                                        <>
                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="password"
                                                    className="ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                                >
                                                    {msg("password")}
                                                    <span className="text-sm absolute right-1">*</span>
                                                </label>
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    autoComplete="new-password"
                                                    className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:ring-2 ${
                                                        messagesPerField.existsError("password")
                                                            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                            : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                                    }`}
                                                />
                                                {messagesPerField.existsError("password") && (
                                                    <span
                                                        className="text-rose-500 text-xs font-medium ml-1 block mt-1"
                                                        dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("password")) }}
                                                    />
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="password-confirm"
                                                    className="ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                                >
                                                    {msg("passwordConfirm")}
                                                    <span className="text-sm absolute right-1">*</span>
                                                </label>
                                                <input
                                                    id="password-confirm"
                                                    name="password-confirm"
                                                    type="password"
                                                    autoComplete="new-password"
                                                    className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:ring-2 ${
                                                        messagesPerField.existsError("password-confirm")
                                                            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                            : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                                    }`}
                                                />
                                                {messagesPerField.existsError("password-confirm") && (
                                                    <span
                                                        className="text-rose-500 text-xs font-medium ml-1 block mt-1"
                                                        dangerouslySetInnerHTML={{
                                                            __html: kcSanitize(messagesPerField.getFirstError("password-confirm"))
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* 6. Términos y Condiciones */}
                                    {termsAcceptanceRequired && (
                                        <TermsAcceptance
                                            i18n={i18n}
                                            messagesPerField={messagesPerField}
                                            areTermsAccepted={areTermsAccepted}
                                            onAreTermsAcceptedValueChange={setAreTermsAccepted}
                                        />
                                    )}

                                    {/* 7. Recaptcha */}
                                    {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                                        <div className="flex justify-center pt-2">
                                            <div
                                                className="g-recaptcha"
                                                data-size="compact"
                                                data-sitekey={recaptchaSiteKey}
                                                data-action={recaptchaAction}
                                            ></div>
                                        </div>
                                    )}

                                    {/* 8. Botón Submit */}
                                    <div className="pt-4">
                                        {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                                            <button
                                                className={clsx(
                                                    "flex h-12 w-full justify-center gap-2 cursor-pointer items-center rounded-xl bg-emerald-800/90 px-7 text-white shadow-emerald-950/30 transition-shadow duration-300 hover:shadow-lg",
                                                    "g-recaptcha"
                                                )}
                                                data-sitekey={recaptchaSiteKey}
                                                data-callback="onSubmitRecaptcha"
                                                data-action={recaptchaAction}
                                                type="submit"
                                            >
                                                {msgStr("doRegister")}
                                            </button>
                                        ) : (
                                            <input
                                                disabled={termsAcceptanceRequired && !areTermsAccepted}
                                                className="flex h-12 w-full justify-center cursor-pointer items-center rounded-xl bg-emerald-800/90 px-7 text-white shadow-emerald-950/30 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                type="submit"
                                                value={msgStr("doRegister")}
                                            />
                                        )}
                                    </div>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-muted-foreground text-sm">
                                        ¿Ya tienes cuenta?{" "}
                                        <a href={url.loginUrl} className="text-emerald-800 font-medium hover:underline">
                                            Inicia sesión aquí
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Alerta Global */}
                            {message !== undefined &&
                                message.type !== "warning" &&
                                !messagesPerField.existsError("username", "password", "email", "firstName", "lastName") && (
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

// Subcomponente de Términos estilizado
function TermsAcceptance(props: {
    i18n: I18n;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
    const { i18n, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;
    const { msg } = i18n;

    return (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="text-slate-600">
                <span className="font-semibold">{msg("termsTitle")}</span>
                <div id="kc-registration-terms-text" className="mt-1 text-xs">
                    {msg("termsText")}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                    checked={areTermsAccepted}
                    onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                    aria-invalid={messagesPerField.existsError("termsAccepted")}
                />
                <label htmlFor="termsAccepted" className="text-xs font-medium text-slate-700 cursor-pointer">
                    {msg("acceptTerms")}
                </label>
            </div>
            {messagesPerField.existsError("termsAccepted") && (
                <span
                    id="input-error-terms-accepted"
                    className="text-rose-500 text-xs font-medium block mt-1"
                    aria-live="polite"
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(messagesPerField.get("termsAccepted"))
                    }}
                />
            )}
        </div>
    );
}
