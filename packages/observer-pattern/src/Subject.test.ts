import { Subject } from './Subject';

describe(Subject.name, () => {
  it('will be call observers', () => {
    const subject = new Subject();

    let calledFuncCount = 0;
    let calledUpdateCount = 0;
    let calledDestroy = false;

    subject.subscribe(() => {
      calledFuncCount += 1;
    });
    subject.subscribe({
      onUpdate: () => {
        calledUpdateCount += 1;
      },
    });
    subject.subscribe({
      onDestroy: () => {
        calledDestroy = true;
      },
    });

    expect(calledFuncCount).toBe(0);
    expect(calledUpdateCount).toBe(0);
    expect(calledDestroy).toBeFalsy();

    subject.update();

    expect(calledFuncCount).toBe(1);
    expect(calledUpdateCount).toBe(1);
    expect(calledDestroy).toBeFalsy();

    subject.update();

    expect(calledFuncCount).toBe(2);
    expect(calledUpdateCount).toBe(2);
    expect(calledDestroy).toBeFalsy();

    subject.destroy();

    expect(calledDestroy).toBeTruthy();
  });
});
