import { TallyPage } from './app.po';

describe('tally App', function() {
  let page: TallyPage;

  beforeEach(() => {
    page = new TallyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('tally works!');
  });
});
