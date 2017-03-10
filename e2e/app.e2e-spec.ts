import { StrichlistePage } from './app.po';

describe('strichliste App', () => {
  let page: StrichlistePage;

  beforeEach(() => {
    page = new StrichlistePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('tally works!');
  });
});
