import i18n from "i18next";

/**
 * Safely localize a value that may be a plain string or an object with language keys.
 * Examples of value shapes:
 * - "Hello"
 * - { en: "Hello", ar: "مرحبا" }
 */
export default function localize(value) {
  if (value == null) return "";
  // If the value is a JSON string (e.g. '{"en":"Hello","ar":"مرحبا"}'),
  // try to parse it into an object and fall through to the object handling.
  if (typeof value === "string") {
    const s = value.trim();
    if (
      (s.startsWith("{") && s.endsWith("}")) ||
      (s.startsWith("[") && s.endsWith("]"))
    ) {
      try {
        const parsed = JSON.parse(s);
        // Re-run localization logic on the parsed object
        return localize(parsed);
      } catch (e) {
        // Not valid JSON - fall back to returning the raw string
        return value;
      }
    }
    return value;
  }
  if (typeof value === "object") {
    const lang = (i18n && i18n.language) || "";
    if (lang && value[lang]) return value[lang];
    const base =
      typeof lang === "string" && lang.split ? lang.split("-")[0] : null;
    if (base && value[base]) return value[base];
    if (value.en) return value.en;
    const firstKey = Object.keys(value)[0];
    return value[firstKey] || "";
  }
  return String(value);
}
