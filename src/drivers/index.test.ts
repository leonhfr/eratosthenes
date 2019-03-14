import * as index from './index';

// Code.
describe('index', () => {
  it('should expose the expected entries', () => {
    expect(index).toMatchSnapshot();
  });
});
