import {doHelloWorld} from '@kalenkevich/test_release_workflow';

export function doHelloWorldDev() {
  const response = doHelloWorld();

  console.log(response);

  return response;
}
