import {doHelloWorld} from '@kalenkevich/test_release_workflow';

export function doHelloWorldDev() {
  const response = doHelloWorld();

  response.goodAfternoon = 'test';
  console.log(response);

  return response;
}
