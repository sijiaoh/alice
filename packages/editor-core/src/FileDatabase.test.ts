import { FileDatabase } from './FileDatabase';
import { MemoryStore } from './MemoryStore';

describe(FileDatabase.name, () => {
  it('can store and get text data', async () => {
    const store = new MemoryStore();

    const fileDatabase1 = new FileDatabase('repository1', store);
    await fileDatabase1.setFile(null, 'id', 'file1');
    const file1 = await fileDatabase1.getFile(null, 'id');
    expect(file1).toBe('file1');

    const fileDatabase2 = new FileDatabase('repository2', store);
    await fileDatabase2.setFile(null, 'id', 'file2');
    const file2 = await fileDatabase2.getFile(null, 'id');
    expect(file2).toBe('file2');
  });
});
