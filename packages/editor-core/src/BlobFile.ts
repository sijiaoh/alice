import pako from 'pako';
import shajs from 'sha.js';
import type { Repository } from './Repository';

export type BlobFileType = 'commit' | 'fileTree' | 'file';

interface BlobFileData {
  type: BlobFileType;
  text: string;
}

/** BlobFileはテキストデータをpacoで圧縮し、sha256 hexを名前名前にしたファイル。 */
export class BlobFile {
  static toBlobFilePath(id: string) {
    return `blob-files/${id}`;
  }

  static compressBlobFileData(blobFileData: BlobFileData) {
    const json = JSON.stringify(blobFileData);
    const compressed = pako.deflate(json, { to: 'string' });
    const id = shajs('sha256').update(compressed).digest('hex');
    return { id, compressed, json };
  }

  static async create(
    repository: Repository,
    type: BlobFileType,
    text: string
  ) {
    const data: BlobFileData = { type, text };
    const { id, compressed } = this.compressBlobFileData(data);
    await repository.store.setValue(this.toBlobFilePath(id), compressed);
    return new BlobFile({ repository, type, id, text, compressed });
  }

  static async load(repository: Repository, id: string) {
    const compressed = await repository.store.getValue(this.toBlobFilePath(id));
    if (compressed === undefined) return undefined;
    const json = pako.inflate(compressed, { to: 'string' });
    const { type, text } = JSON.parse(json) as BlobFileData;
    return new BlobFile({ repository, type, id, text, compressed });
  }

  readonly repository: Repository;
  readonly type: BlobFileType;
  readonly id: string;
  readonly text: string;
  readonly compressed: string;

  private constructor({
    repository,
    type,
    id,
    text,
    compressed,
  }: {
    repository: Repository;
    type: BlobFileType;
    id: string;
    text: string;
    compressed: string;
  }) {
    this.repository = repository;
    this.type = type;
    this.id = id;
    this.text = text;
    this.compressed = compressed;
  }
}
