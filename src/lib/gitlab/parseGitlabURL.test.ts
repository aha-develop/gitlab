import { parseGitlabURL } from './parseGitlabURL';

describe('parseGitlabURL', () => {
  it('should extract repo path and MR id correctly from a gitlab url', () => {
    const url = 'https://gitlab.com/jemmyw/small-mammals/-/merge_requests/2';
    const expected = {
      repo: 'jemmyw/small-mammals',
      mrId: '2'
    };
    const result = parseGitlabURL(url);
    expect(result).toEqual(expected);
  });

  it('should extract repo path and MR id correctly from gitlab url that has nested groups', () => {
    const url = 'https://gitlab.com/my-company/apps/developt-test/-/merge_requests/1';
    const expected = {
      repo: 'my-company/apps/developt-test',
      mrId: '1'
    };
    const result = parseGitlabURL(url);
    expect(result).toEqual(expected);
  });

  it('should return undefined when url does not match expected format', () => {
    const url = 'https://invalid-url.com';
    const result = parseGitlabURL(url);
    expect(result).toBeUndefined();
  });

  it('should work with any domain', () => {
    const url = 'https://my-gitlab-instance.com/my-company/apps/developt-test/-/merge_requests/1';
    const expected = {
      repo: 'my-company/apps/developt-test',
      mrId: '1'
    };
    const result = parseGitlabURL(url);
    expect(result).toEqual(expected);
  });
});
