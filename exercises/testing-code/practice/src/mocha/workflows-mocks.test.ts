import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker } from '@temporalio/worker';
import assert from 'assert';
import { before, describe, it } from 'mocha';
import sinon from 'sinon';
import { TranslationActivityInput, TranslationActivityOutput } from '../shared';
import { sayHelloGoodbyeWorkflow } from '../workflows';

describe('SayHelloGoodbye workflow', () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  after(async () => {
    await sinon.restore();
  });

  it('successfully completes French translation with a mocked call', async () => {
    const workflowInput = {
      name: "Pierre",
      languageCode: "fr",
    };
    const helloInput: TranslationActivityInput = {
      term: 'Hello',
      languageCode: workflowInput.languageCode
    };
    const helloOutput: TranslationActivityOutput = {
      translation: 'Bonjour'
    };
    const goodbyeInput: TranslationActivityInput = {
      term: 'Goodbye',
      languageCode: workflowInput.languageCode
    };
    const goodbyeOutput: TranslationActivityOutput = {
      translation: 'Au revoir'
    };

    const { client, nativeConnection } = testEnv;

    const translateTermMock = sinon.stub();
    translateTermMock.withArgs(helloInput).resolves(helloOutput);
    translateTermMock.withArgs(goodbyeInput).resolves(goodbyeOutput);

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue: 'test',
      workflowsPath: require.resolve('../workflows'),
      activities: { translateTerm: translateTermMock },
    });

    const result = await worker.runUntil(
      client.workflow.execute(sayHelloGoodbyeWorkflow, {
        args: [workflowInput],
        workflowId: 'test',
        taskQueue: 'test',
      })
    );

    assert.equal(result.helloMessage, 'Bonjour, Pierre');
    assert.equal(result.goodbyeMessage, 'Au revoir, Pierre');

  });
});

