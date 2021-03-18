import { importClasses, importNPCs } from './scripts';

const main = async () => {
  await importClasses();
  await importNPCs();
}

main();