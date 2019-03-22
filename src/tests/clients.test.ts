import * as clients from '../clients';

// Code.
describe('clients', () => {
  it('should expose the expected entries', () => {
    expect(clients).toMatchSnapshot();
  });
});
