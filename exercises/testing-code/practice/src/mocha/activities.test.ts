import { MockActivityEnvironment } from '@temporalio/testing';
import assert from 'assert';
import { describe, it } from 'mocha';
import * as activities from '../activities';
import { TranslationActivityOutput } from '../shared';

describe('translateTerm activity', async () => {
  it('successfully translates "Hello" to German', async () => {
    const env = new MockActivityEnvironment();
    const input = {
      term: 'Hello',
      languageCode: 'de',
    };
    const result: TranslationActivityOutput = await env.run(activities.translateTerm, input);
    assert.equal(result.translation, 'Hallo');
  });

  // TODO: add the `successfully translates "Goodbye" to Latvian` test here.
  it('successfully translates "Goodbye" to Latvian', async () => {
    const env = new MockActivityEnvironment();
    const input = {
      term: 'Goodbye',
      languageCode: 'lv',
    };
    const result: TranslationActivityOutput = await env.run(activities.translateTerm, input);
    assert.equal(result.translation, 'Ardievu');
  });

  // TODO:  paste the 'fails to translate with bad language code' test here.
  it('fails to translate with bad language code', async () => {
    const env = new MockActivityEnvironment();
    const input = {
      term: "Hello",
      languageCode: "xq",
    };
    try {
      await env.run(activities.translateTerm, input);
      assert.fail('Expected error was not thrown');
    } catch (err: any) {
      console.log(err.message)
      assert(err.message.includes("HTTP Error 400: Unknown language code \"xq\""));
    }
  });
});
