// TODO import the sleep and log packages here by adding it to the list.
import { log, proxyActivities, sleep } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { TranslationWorkflowInput, TranslationWorkflowOutput } from './shared';

const { translateTerm } = proxyActivities<typeof activities>({
  startToCloseTimeout: '45 seconds',
});

export async function sayHelloGoodbyeWorkflow(input: TranslationWorkflowInput): Promise<TranslationWorkflowOutput> {
  // TODO Log, at the Info level, when the Workflow function is invoked
  //      and be sure to include the name passed as input
  log.info('SayHelloGoodbye workflow invoked', { name: input.name });

  const helloInput = {
    term: 'Hello',
    languageCode: input.languageCode,
  };

  // TODO Log, at the Debug level, a message about the Activity to be executed,
  //      be sure to include the language code passed as input
  log.debug('Preparing to start Hello Message activity', { languageCode: input.languageCode });
  const helloResult = await translateTerm(helloInput);
  const helloMessage = `${helloResult.translation}, ${input.name}`;

  // TODO: (Part C): log a message at the Debug level and then start a Timer for 10 seconds
  log.debug('Sleeping between translation calls');
  await sleep("10 seconds");

  const goodbyeInput = {
    term: 'Goodbye',
    languageCode: input.languageCode,
  };

  // TODO Log, at the Debug level, a message about the Activity to be executed,
  //      be sure to include the language code passed as input
  log.debug('Preparing to start Goodbye Message activity', { languageCode: input.languageCode });
  const goodbyeResult = await translateTerm(goodbyeInput);
  const goodbyeMessage = `${goodbyeResult.translation}, ${input.name}`;

  return { helloMessage, goodbyeMessage };
}
