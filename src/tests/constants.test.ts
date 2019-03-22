import * as constants from '../constants';

// Code.
describe('constants', () => {
  it('should expose the expected entries', () => {
    expect(constants).toMatchSnapshot();
  });
});
