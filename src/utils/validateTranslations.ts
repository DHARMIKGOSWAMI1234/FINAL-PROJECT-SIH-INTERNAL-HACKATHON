import { en } from '../data/translations/en';
import { hi } from '../data/translations/hi';
import { gu } from '../data/translations/gu';

/**
 * Development-time translation key structure validator.
 * Compares en.ts keys recursively against hi.ts and gu.ts.
 */
export function validateTranslations(): void {
  if (typeof import.meta !== 'undefined' && import.meta.env && !import.meta.env.DEV) return;

  const getKeys = (obj: Record<string, any>, prefix = ''): string[] => {
    let keys: string[] = [];
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const fullPath = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          keys = keys.concat(getKeys(obj[key], fullPath));
        } else {
          keys.push(fullPath);
        }
      }
    }
    return keys;
  };

  const enKeys = getKeys(en);
  const hiKeys = new Set(getKeys(hi));
  const guKeys = new Set(getKeys(gu));

  const missingInHi = enKeys.filter((k) => !hiKeys.has(k));
  const missingInGu = enKeys.filter((k) => !guKeys.has(k));

  if (missingInHi.length > 0) {
    console.warn('⚠️ [i18n Warning] Missing keys in Hindi (hi.ts):', missingInHi);
  }
  if (missingInGu.length > 0) {
    console.warn('⚠️ [i18n Warning] Missing keys in Gujarati (gu.ts):', missingInGu);
  }

  if (missingInHi.length === 0 && missingInGu.length === 0) {
    console.log('✅ [i18n Verified] All translation keys in EN, HI, and GU match 100%!');
  }
}
