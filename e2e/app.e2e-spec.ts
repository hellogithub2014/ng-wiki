import { NgWikiPage } from './app.po';

describe('ng-wiki App', () => {
  let page: NgWikiPage;

  beforeEach(() => {
    page = new NgWikiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
