export type imageFormats = 'jpg' | 'png' | 'webp' | 'gif';
export type imageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export interface ImageUrlOptions {
    /**
     * the format of the image
     * @default jpg
     */
    format?: imageFormats;
    /**
     * the size of the image
     * @default 4096
     */
    size?: imageSize;
    /**
     * if the avatar are animated give gif url
     * @default false
     */
    dynamic?: boolean;
}