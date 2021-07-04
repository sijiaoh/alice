import { Subject } from './Subject';

describe(Subject.name, () => {
  it('will be call observers', () => {
    const subject = new Subject();

    let calledFunc = false;
    let calledUpdate = false;
    let calledDestroy = false;

    subject.subscribe(() => {
      calledFunc = true;
    });
    subject.subscribe({
      onUpdate: () => {
        calledUpdate = true;
      },
    });
    subject.subscribe({
      onDestroy: () => {
        calledDestroy = true;
      },
    });

    subject.update();

    expect(calledFunc).toBeTruthy();
    expect(calledUpdate).toBeTruthy();
    expect(calledDestroy).toBeFalsy();

    subject.destroy();

    expect(calledDestroy).toBeTruthy();
  });
});
