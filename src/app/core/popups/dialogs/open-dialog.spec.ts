import { OpenDialog } from './open-dialog';

describe('OpenDialog', () => {
  it('should create an instance', () => {
    expect(
      new OpenDialog({
        message: '',
        title: '',
        type: 'confirm',
        action: 'TEST DISPATCHER ACTION DIALOG',
      })
    ).toBeTruthy();
  });
});
