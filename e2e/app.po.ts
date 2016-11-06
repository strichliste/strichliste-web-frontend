import { browser, element, by } from 'protractor';

export class TallyPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('tally-root h1')).getText();
  }
}
