import { Extension, ImageExtension, VideoExtension } from "../../types/e2e/attachment-extension.t";

import { TestSettings } from "../../configuration/test-settings";

type MimeDict = {
    [key in Extension]: string;
}


class AttachmentPathResolverBase<ExtensionType extends Extension> {
    private readonly basePath = 'FileResources/testFile';
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private static mimeMap: MimeDict = {
        "jpg": "image/jpeg",
        "dll": "application/dll", 
        "mp4": "video/mp4",
        "jpeg": "image/jpeg",
        "gif": "image/gif",
        "png": "image/png",
        "mp3": "audio/mpeg",
        "oga": "audio/ogg",
        "amr": "audio/amr",
        "pdf": "application/pdf",
        "csv": "text/csv"
    };

    public getFilePath(extension: ExtensionType) {
        return this.basePath.concat(`.${extension}`);
    }

    public getFileURL(extension: ExtensionType) {
        return this.baseUrl.concat(`.${extension}`);
    }

    public getMimeType(extension: ExtensionType) {
        return AttachmentPathResolverBase.mimeMap[extension];
    }

    public getTestFileName(extension: ExtensionType) {
        return `testFile.${extension}`;
    }
}

export class AttachmentPathResolver extends AttachmentPathResolverBase<Extension> {
    private static instance = new AttachmentPathResolver();
    public static get Instance() {
        return this.instance;
    }

    private constructor() {
        super(`${TestSettings.BlobURL}/testFile`);
    }
}

// Twitter supports only image\gif\video types
export class TwitterAttachmentPathResolver extends AttachmentPathResolverBase<ImageExtension> {
    private static instance = new TwitterAttachmentPathResolver();
    public static get Instance() {
        return this.instance;
    }
    
    // We can not use blob to store twitter attachments since AsyncConnector force Autorization to load the file when using Twitter channel.
    // The blob will reject the wrong auth signature even if it is configured as public blob.
    private constructor() {
        super(TestSettings.TwitterAttachmentsSource);
    }
}

// We use only supported extension in E2E automation (Images at this point) since the unsupported attachments are being converted to the text message
// payloads on the Twilio side. Simulating this logic doesn't make sense for testing purposes.
export class WhatsAppAttachmentsPathResolver extends AttachmentPathResolverBase<ImageExtension | VideoExtension> {
    private static instance = new WhatsAppAttachmentsPathResolver();
    public static get Instance() {
        return this.instance;
    }

    private constructor() {
        super(`${TestSettings.BlobURL}/testFile`);
    }
}
