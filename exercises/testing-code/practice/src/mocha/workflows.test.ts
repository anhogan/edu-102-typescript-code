import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker } from '@temporalio/worker';
import assert from 'assert';
import { before, describe, it } from 'mocha';
import * as activities from '../activities';
import { sayHelloGoodbyeWorkflow } from '../workflows';

describe('SayHelloGoodbye workflow', () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  it('successfully completes French translation', async () => {

    const { client, nativeConnection } = testEnv;

    const workflowInput = {
      name: "Pierre",
      languageCode: "fr",
    };

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue: 'test',
      workflowsPath: require.resolve('../workflows'),
      activities,
    });

    const result = await worker.runUntil(
      client.workflow.execute(sayHelloGoodbyeWorkflow, {
        args: [workflowInput],
        workflowId: 'test',
        taskQueue: 'test',
      })
    );

    // TODO: Assert that the HelloMessage field in the
    //       result is: Bonjour, Pierre
    assert.equal(result.helloMessage, 'Bonjour, Pierre');

    // TODO: Assert that the GoodbyeMessage field in the
    //       result is: Au revoir, Pierre
    assert.equal(result.goodbyeMessage, 'Au revoir, Pierre');
  });
});

