import axios from 'axios';

// TODO import everything from the @temporalio/activity package as activity
import * as activity from '@temporalio/activity';

import { TranslationActivityInput, TranslationActivityOutput } from './shared';

export async function translateTerm(input: TranslationActivityInput): Promise<TranslationActivityOutput> {
  // TODO Define an Activity logger
  const context = activity.Context.current();

  // TODO log Activity invocation, at the Info level, and include the term being
  //      translated and the language code as name-value pairs
  context.log.info('Translating term: ', { term: input.term, languageCode: input.languageCode });

  const lang = encodeURIComponent(input.languageCode);
  const term = encodeURIComponent(input.term);

  const url = `http://localhost:9998/translate?lang=${lang}&term=${term}`;

  try {
    const response = await axios.get(url);
    const content = response.data;
    // TODO  use the Debug log level to log the successful translation and include the
    //       translated term as a name-value pair
    context.log.debug('Translation successful!', { translation: content });
    return { translation: content };
  } catch (error: any) {
    if (error.response) {
      // TODO  use the Error log level to log the failed response and include the
      //       response status and response data using error.response.status
      //       and error.response.data
      context.log.error('Response failed', { status: error.response.status, data: error.response.data });
      throw new Error(`HTTP Error ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
      // TODO  use the Error log level to log the failed request and include the
      //       value of error.request
      context.log.error('Request failed', { request: error.request });
      throw new Error(`Request error:  ${error.request}`);
    }
    // TODO  use the Error log level to log that something else went wrong with
    //       the translation. Print out the value of `error`.
    context.log.error('Something went wrong during translation', { error });
    throw new Error('Something else failed during translation.');
  }
}
