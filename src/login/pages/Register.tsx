import { useState, useLayoutEffect } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Footer from "../components/Footer";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>;

// --- FUNCIONES DE VALIDACIÓN Y FORMATO ---

const formatRUT = (value: string) => {
    // Deja solo números y la letra K
    let clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
    if (clean.length === 0) return "";
    if (clean.length === 1) return clean;

    // Separa el DV del resto del cuerpo
    const dv = clean.slice(-1);
    let rutBody = clean.slice(0, -1);

    // Agrega los puntos de miles
    rutBody = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${rutBody}-${dv}`;
};

const isValidRUT = (rutCompleto: string) => {
    if (!/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9K]{1}$/i.test(rutCompleto)) return false;
    let clean = rutCompleto.replace(/[^0-9kK]/gi, "").toUpperCase();
    let cuerpo = clean.slice(0, -1);
    let dv = clean.slice(-1);
    let suma = 0;
    let multiplo = 2;

    for (let i = 1; i <= cuerpo.length; i++) {
        let index = multiplo * parseInt(cuerpo.charAt(cuerpo.length - i));
        suma = suma + index;
        if (multiplo < 7) multiplo = multiplo + 1;
        else multiplo = 2;
    }

    let dvEsperado = 11 - (suma % 11);
    let dvCalculado = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
    return dvCalculado === dv;
};

const formatTelefono = (value: string) => {
    // Deja solo los dígitos
    let digits = value.replace(/\D/g, "");

    // Filtramos si el usuario escribe el +56 o el 9
    if (digits.startsWith("56")) digits = digits.slice(2);
    if (digits.startsWith("9")) digits = digits.slice(1);

    // Máximo de 8 dígitos después del 9
    digits = digits.slice(0, 8);

    let formatted = "+56 9";
    if (digits.length > 0) formatted += " " + digits.substring(0, 4);
    if (digits.length > 4) formatted += " " + digits.substring(4, 8);

    // Si el usuario borra todo, limpiamos el input
    if (value === "" || value === "+") return "";
    return formatted;
};

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
    const register = (kcContext as any).register;
    const { msg, msgStr } = i18n;

    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    const [rutState, setRutState] = useState(formatRUT(register?.formData?.["user.attributes.rut"] || ""));
    const [telefonoState, setTelefonoState] = useState(formatTelefono(register?.formData?.["user.attributes.telefono"] || ""));

    const [isLoading, setIsLoading] = useState(false);

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

    // Handlers para validar en tiempo real
    const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatRUT(e.target.value);
        setRutState(formatted);

        // Bloquea el envío nativo del formulario si el RUT no es válido matemáticamente
        if (formatted.length > 0 && !isValidRUT(formatted)) {
            e.target.setCustomValidity("El RUT ingresado no es válido.");
        } else {
            e.target.setCustomValidity("");
        }
    };

    const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatTelefono(e.target.value);
        setTelefonoState(formatted);

        // El teléfono debe tener exactamente 15 caracteres: "+56 9 XXXX XXXX"
        if (formatted.length > 0 && formatted.length < 15) {
            e.target.setCustomValidity("El teléfono debe tener 9 dígitos.");
        } else {
            e.target.setCustomValidity("");
        }
    };

    // Funciones auxiliares para verificar si un campo tiene error (Soluciona lo del borde rojo)
    const hasRutError = messagesPerField.existsError("rut") || messagesPerField.existsError("user.attributes.rut");
    const hasTelefonoError = messagesPerField.existsError("telefono") || messagesPerField.existsError("user.attributes.telefono");

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex flex-1 items-center justify-around relative font-outfit">
                <div className="flex items-center justify-center px-4 py-12">
                    <div className="max-w-md space-y-6">
                        {/* Cabecera y Logo idénticos al Login */}
                        <div className="mb-4 space-y-2.5 text-center">
                            <img
                                src={`${import.meta.env.BASE_URL}mascota_icon.png`}
                                alt="Logo Acción Mascota"
                                width={200}
                                height={32}
                                className="-mt-2 mb-0 h-16 w-24 place-self-center object-cover"
                            />
                            <p className="mx-auto inline-flex items-center rounded-full bg-emerald-50 px-4 py-1 text-[11px] font-semibold tracking-[0.18em] text-emerald-800 uppercase">
                                Portal ciudadano · Tenencia responsable
                            </p>
                            <h1 className="text-gray-800 text-2xl font-extrabold">Crear Cuenta</h1>
                            <p className="text-sm text-gray-600">Completa tus datos para registrarte en la plataforma</p>
                        </div>

                        {/* Tarjeta de Registro */}
                        <div className="flex flex-col gap-6 rounded-xl py-2 text-gray-600">
                            <div className="px-6s">
                                <form
                                    id="kc-register-form"
                                    action={url.registrationAction}
                                    method="post"
                                    className="space-y-4"
                                    onSubmit={() => setIsLoading(true)}
                                >
                                    {/* 1. Nombre */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="firstName"
                                            className="ml-1 mb-0.5 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                        >
                                            {msg("firstName")}
                                            {/* <span className="text-sm absolute right-1">*</span> */}
                                        </label>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            defaultValue={register?.formData?.firstName ?? ""}
                                            type="text"
                                            placeholder="Mis nombres"
                                            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm shadow-gray-200/80 transition-all outline-none placeholder:text-[13px] placeholder:text-slate-400/70 focus-within:ring-2 ${
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
                                            className="ml-1 mb-0.5 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                        >
                                            {msg("lastName")}
                                            {/* <span className="text-sm absolute right-1">*</span> */}
                                        </label>
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            defaultValue={register?.formData?.lastName ?? ""}
                                            type="text"
                                            placeholder="Mis apellidos"
                                            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm shadow-gray-200/80 transition-all outline-none placeholder:text-[13px] placeholder:text-slate-400/70 focus-within:ring-2 ${
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

                                    <div className="grid grid-cols-2 gap-2">
                                        {/* 3 RUT (Controlado y Formateado) */}
                                        <div className="space-y-1">
                                            <label
                                                htmlFor="user.attributes.rut"
                                                className="ml-1 mb-0.5 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                            >
                                                RUT
                                                {/* <span className="text-sm absolute right-1">*</span> */}
                                            </label>
                                            <input
                                                id="user.attributes.rut"
                                                name="user.attributes.rut"
                                                value={rutState}
                                                onChange={handleRutChange}
                                                type="text"
                                                placeholder="Ej: 12.345.678-9"
                                                maxLength={12}
                                                className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm shadow-gray-200/80 transition-all outline-none placeholder:text-[13px] placeholder:text-slate-400/70 focus-within:ring-2 ${
                                                    hasRutError
                                                        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                        : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                                }`}
                                            />
                                            {hasRutError && (
                                                <span
                                                    className="text-rose-500 text-xs font-medium ml-1 block mt-1"
                                                    dangerouslySetInnerHTML={{
                                                        __html: kcSanitize(messagesPerField.getFirstError("rut", "user.attributes.rut"))
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* 4 Teléfono (Controlado y Formateado) */}
                                        <div className="space-y-1">
                                            <label
                                                htmlFor="user.attributes.telefono"
                                                className="ml-1 mb-0.5 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                            >
                                                Teléfono
                                                {/* <span className="text-sm absolute right-1">*</span> */}
                                            </label>
                                            <input
                                                id="user.attributes.telefono"
                                                name="user.attributes.telefono"
                                                value={telefonoState}
                                                onChange={handleTelefonoChange}
                                                type="tel"
                                                placeholder="Ej: +56 9 1234 5678"
                                                maxLength={15}
                                                className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm shadow-gray-200/80 transition-all outline-none placeholder:text-[13px] placeholder:text-slate-400/70 focus-within:ring-2 ${
                                                    hasTelefonoError
                                                        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                                                        : "border-slate-200 text-gray-700 focus-within:border-blue-400 focus-within:ring-blue-100"
                                                }`}
                                            />
                                            {hasTelefonoError && (
                                                <span
                                                    className="text-rose-500 text-xs font-medium ml-1 block mt-1"
                                                    dangerouslySetInnerHTML={{
                                                        __html: kcSanitize(messagesPerField.getFirstError("telefono", "user.attributes.telefono"))
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* 5. Email */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="email"
                                            className="ml-1 mb-0.5 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                        >
                                            {msg("email")}
                                            {/* <span className="text-sm absolute right-1">*</span> */}
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            defaultValue={register?.formData?.email ?? ""}
                                            type="email"
                                            placeholder="ejemplo@gmail.com"
                                            autoComplete="email"
                                            className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm shadow-gray-200/80 transition-all outline-none placeholder:text-[13px] placeholder:text-slate-400/70 focus-within:ring-2 ${
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

                                    {/* 6. Username (Solo si el panel de control NO obliga a usar el email como usuario) */}
                                    {!realm.registrationEmailAsUsername && (
                                        <div className="space-y-1">
                                            <label
                                                htmlFor="username"
                                                className="ml-1 mb-0.5 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                            >
                                                {msg("username")}
                                                {/* <span className="text-sm absolute right-1">*</span> */}
                                            </label>
                                            <input
                                                id="username"
                                                name="username"
                                                defaultValue={""}
                                                type="text"
                                                placeholder="Nombre pesonalizado"
                                                autoComplete="username"
                                                className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm shadow-gray-200/80 transition-all outline-none placeholder:text-[13px] placeholder:text-slate-400/70 focus-within:ring-2 ${
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

                                    {/* 7. Contraseñas */}
                                    {passwordRequired && (
                                        <>
                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="password"
                                                    className="ml-1 mb-0.5 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                                >
                                                    {msg("password")}
                                                    {/* <span className="text-sm absolute right-1">*</span> */}
                                                </label>
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    autoComplete="new-password"
                                                    className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm shadow-gray-200/80 transition-all outline-none placeholder:text-[13px] placeholder:text-slate-400/70 focus-within:ring-2 ${
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
                                                    className="ml-1 mb-0.5 flex justify-between text-[10px] font-bold text-slate-500 uppercase relative"
                                                >
                                                    {msg("passwordConfirm")}
                                                    {/* <span className="text-sm absolute right-1">*</span> */}
                                                </label>
                                                <input
                                                    id="password-confirm"
                                                    name="password-confirm"
                                                    type="password"
                                                    autoComplete="new-password"
                                                    className={`h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm shadow-gray-200/80 transition-all outline-none placeholder:text-[13px] placeholder:text-slate-400/70 focus-within:ring-2 ${
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

                                    {/* 8. Términos y Condiciones */}
                                    {termsAcceptanceRequired && (
                                        <TermsAcceptance
                                            i18n={i18n}
                                            messagesPerField={messagesPerField}
                                            areTermsAccepted={areTermsAccepted}
                                            onAreTermsAcceptedValueChange={setAreTermsAccepted}
                                        />
                                    )}

                                    {/* 9. Recaptcha */}
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

                                    {/* 10. Botón Submit */}
                                    <div className="pt-4">
                                        {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                                            <button
                                                disabled={isLoading}
                                                className={clsx(
                                                    `group relative flex h-12 min-w-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl font-semibold text-white shadow-lg shadow-gray-200 transition-all duration-300 ${isLoading ? "cursor-not-allowed bg-emerald-900/50" : "bg-emerald-800/90 hover:bg-emerald-700"}`,
                                                    "g-recaptcha"
                                                )}
                                                data-sitekey={recaptchaSiteKey}
                                                data-callback="onSubmitRecaptcha"
                                                data-action={recaptchaAction}
                                                type="submit"
                                            >
                                                {/* Overlay gradiente para hover */}
                                                {!isLoading && (
                                                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-600 via-emerald-700 to-emerald-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                )}
                                                <div className="relative z-10 flex items-center justify-center gap-2">
                                                    {/* Spinner reemplaza el texto cuando carga */}
                                                    {isLoading ? (
                                                        <div className="flex items-center justify-center">
                                                            <div className="size-5 animate-spin rounded-full border-4 border-white/80 border-t-emerald-800/60" />
                                                        </div>
                                                    ) : (
                                                        msgStr("doRegister")
                                                    )}
                                                </div>
                                            </button>
                                        ) : (
                                            <button
                                                disabled={(termsAcceptanceRequired && !areTermsAccepted) || isLoading}
                                                type="submit"
                                                className={`group relative flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl font-semibold text-white shadow-lg shadow-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    isLoading ? "bg-emerald-900/50" : "bg-emerald-800/90 hover:bg-emerald-700"
                                                }`}
                                            >
                                                {!isLoading && !(termsAcceptanceRequired && !areTermsAccepted) && (
                                                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-600 via-emerald-700 to-emerald-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                )}
                                                <div className="relative z-10 flex items-center justify-center gap-2">
                                                    {isLoading ? (
                                                        <div className="flex items-center justify-center">
                                                            <div className="size-5 animate-spin rounded-full border-4 border-white/80 border-t-emerald-800/60" />
                                                        </div>
                                                    ) : (
                                                        msgStr("doRegister")
                                                    )}
                                                </div>
                                            </button>
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
