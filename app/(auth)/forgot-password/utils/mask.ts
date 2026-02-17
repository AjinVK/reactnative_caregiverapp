export const maskPhone = (phone?: string) => {
    if (!phone) return "";

    const clean = phone.replace(/\D/g, "");

    if (clean.length <= 3) return clean;

    return `${clean.slice(0, clean.length - 3)}***`;
};

export const maskEmail = (email?: string) => {
    if (!email) return "";

    const [name, domain] = email.split("@");
    if (!domain) return email;

    if (name.length <= 2) {
        return `*@${domain}`;
    }

    return `${name.slice(0, 2)}***@${domain}`;
};

export default maskEmail;