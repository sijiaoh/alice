import { BlobFile, BlobFileType } from './BlobFile';
import { Repository } from './Repository';

export class BlobFileManager {
  constructor(repository: Repository) {
    this.repository = repository;
  }

  async findOrCreateBlobFile(type: BlobFileType, text: string) {
    const { id } = BlobFile.compressBlobFileData({ type, text });
    const blobFile = this.blobFiles[id];
    if (blobFile) return blobFile;
    return BlobFile.create(this.repository, type, text);
  }

  async findOrLoadBlobFile(id: string) {
    const blobFile = this.blobFiles[id];
    if (blobFile) return blobFile;
    return BlobFile.load(this.repository, id);
  }

  repository: Repository;
  blobFiles: { [id: string]: BlobFile | undefined } = {};
}
