import { Uploader, UploadParams } from '@/domain/forum/app/storage/uploader';
import { randomUUID } from 'node:crypto';

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  private _uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID();
    this._uploads.push({ fileName, url });

    return { url };
  }

  get uploads() {
    return this._uploads;
  }
}
