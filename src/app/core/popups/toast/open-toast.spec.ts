import { OpenToast } from './open-toast';

describe('OpenToast', () => {
  it('should create an instance', () => {
    expect(
      new OpenToast({ message: 'Test Dispatch', title: '', type: 'success' })
    ).toBeTruthy();
  });
});
