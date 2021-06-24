import { EditorCore } from './EditorCore';
import { MemoryStore } from './MemoryStore';

describe('File', () => {
  const prepare = async () => {
    const store = new MemoryStore();
    const editorCore = new EditorCore(store);
    const repository = await editorCore.repositoryManager.createNewRepository(
      'name'
    );
    const fileTree = await repository.fileTreeManager.findOrLoadFileTree(null);
    const id = fileTree.createNewFile('file/path', '');
    const file = repository.fileManager.findOrLoadFile(id, '');
    return { store, editorCore, repository, file };
  };

  describe('changed', () => {
    it('will set to true when content changed', () => {
      const { file } = prepare();

      expect(file.changed).toBe(false);
      expect(file.content).toBe('');
      file.content = '1';
      expect(file.changed).toBe(true);
      expect(file.content).toBe('1');
    });
  });

  it('will save file to store', () => {
    const dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => 0);

    const { store, repository, file } = prepare();

    const newFilePath = `${repository.id}/new/files/${file.id}.json`;
    const swapFilePath = `${repository.id}/swap/files/${file.id}.json`;

    // Create new file will create store record.
    const ctime = Date.now();
    const fileData: FileData<string> = {
      id: file.id,
      ctime,
      mtime: ctime,
      content: '',
    };
    expect(store.memory).toEqual({
      [newFilePath]: JSON.stringify(fileData, null, 2),
    });

    dateSpy.mockImplementation(() => 1);

    // Create swap file when changed=true.
    file.content = '1';
    const changedFileData = {
      id: file.id,
      ctime,
      mtime: Date.now(),
      content: '1',
    };
    expect(store.memory).toEqual({
      [newFilePath]: JSON.stringify(fileData, null, 2),
      [swapFilePath]: JSON.stringify(changedFileData, null, 2),
    });
    file.content = '2';
    changedFileData.content = '2';
    expect(store.memory).toEqual({
      [newFilePath]: JSON.stringify(fileData, null, 2),
      [swapFilePath]: JSON.stringify(changedFileData, null, 2),
    });

    // Remove swap file and update new file when called save.
    file.save();
    expect(store.memory).toEqual({
      [newFilePath]: JSON.stringify(changedFileData, null, 2),
    });

    // Remove file.
    file.remove();
    expect(store.memory).toEqual({});

    dateSpy.mockRestore();
  });
});
