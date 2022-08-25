import { validateMrURL } from './validateMrURL';

describe('validateMrURL', () => {
  it('successed for valid urls', () => {
    expect(validateMrURL('https://gitlab.com/example/example/project/merge_requests/1')).toBeTruthy();
  });

  [
    'not a url',
    'https://anotherdomain.com/example/example/project/merge_requests/1',
    'http://gitlab.com/example/example/project/merge_requests/1',
    'https://gitlab.com/example/example/merge_requests/1',
    'https://gitlab.com/example/example/project/merge_requests/a'
  ].forEach((url) => {
    it(`fails for invalid url ${url}`, () => {
      expect(validateMrURL(url)).toBeFalsy();
    });
  });
});
