import * as models from '../models';

// Code.
describe('models', () => {
  it('should expose the expected entries', () => {
    expect(models).toMatchSnapshot();
  });
});
