export type ImageExtension = "jpg";
export type ApplicationExtension = "dll";
export type VideoExtension = "mp4";
export type JpegExtension = "jpeg";
export type GifExtension = "gif";
export type PngExtension = "png";
export type Mp3Extension = "mp3";
export type OgaExtension = "oga";
export type AmrExtension = "amr";
export type PdfExtension = "pdf";
export type CsvExtension = "csv";
export type Extension = ImageExtension | ApplicationExtension | VideoExtension | 
    JpegExtension | GifExtension | Mp3Extension | OgaExtension | AmrExtension |
    PdfExtension | CsvExtension | PngExtension;

// Type guards

export function isImageExtension(extension: any): extension is ImageExtension {
    return ["jpg"].includes(extension); // Use array to handle extensions list in case of adding more file types in automation
}

export function isVideoExtension(extension: any): extension is VideoExtension {
    return ["mp4"].includes(extension); // Use array to handle extensions list in case of adding more file types in automation
}