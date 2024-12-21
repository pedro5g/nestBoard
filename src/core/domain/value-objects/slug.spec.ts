import { Slug } from './slug';

test('it should be able to create a new slug text', () => {
  const slug = Slug.toSlug('Example Question Title');

  expect(slug.value).toEqual('example-question-title');
});
