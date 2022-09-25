// https://stackoverflow.com/questions/54438012/an-index-signature-parameter-type-cannot-be-a-union-type-consider-using-a-mappe
type PartialRecord<K extends string, T> = { [P in K]?: T; };

export type translatable = {
    [key: string]: translations
    
}
export type translations = PartialRecord<languages, string>

export type translatableVariable =
    string
    | translatableCallback
    | PartialRecord<languages, string>;
export type translatableCallback = (language: languages) => string;

export type languages = apiLanguages | simpleLanguages;

export type apiLanguages =
    'da'
    | 'de'
    | 'en-GB'
    | 'en-US'
    | 'es-ES'
    | 'fr'
    | 'hr'
    | 'it'
    | 'lt'
    | 'hu'
    | 'nl'
    | 'no'
    | 'pl'
    | 'pt-BR'
    | 'ro'
    | 'fi'
    | 'sv-SE'
    | 'vi'
    | 'tr'
    | 'cs'
    | 'el'
    | 'bg'
    | 'ru'
    | 'uk'
    |
    'hi'
    | 'th'
    | 'zh-CN'
    | 'ja'
    | 'zh-TW'
    | 'ko';

export type simpleLanguages = 'en' | 'zh';
