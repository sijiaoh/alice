import { EditorCore } from './EditorCore';
import { MemoryStore } from './MemoryStore';

describe(EditorCore.name, () => {
  it('can management repository', async () => {
    const store = new MemoryStore();
    const editorCore = new EditorCore(store);
    const repository = await editorCore.repositoryManager.createNewRepository(
      'repo'
    );
    const commit = await repository.commitManager.findOrLoadCommit(
      repository.headCommitId
    );
    const fileTree = await commit.getOrLoadFileTree();
    const path = 'path';
    const text = 'text';
    const id = await fileTree.createNewFile(path, text);

    let file1 = await fileTree.findOrLoadFileWithId<string>(id);
    let file2 = await fileTree.findOrLoadFileWithId<string>(path);
    expect(file1).toBe(file2);
    expect(file1.content).toBe(text);

    let unloaded = false;
    file2.subscribe({
      onDestroy: () => {
        unloaded = true;
      },
    });
    file1.unload();
    expect(unloaded).toBeTruthy();

    file1 = await fileTree.findOrLoadFileWithId<string>(id);
    file2 = await fileTree.findOrLoadFileWithId<string>(path);
    expect(file1).toBe(file2);
    expect(file1.content).toBe(text);
    file2.subscribe({
      onDestroy: () => {
        unloaded = true;
      },
    });
    await file1.remove();
    expect(unloaded).toBeTruthy();
    const file3 = await fileTree.findOrLoadFileWithId(id);
    expect(file3).toBeUndefined();
  });
});
