import { getApi, downloadIcon } from '../lib';

const importClasses = async () => {
  console.log("Importing class images...")
  // Since their are only a few classes we can query them all at once
  const { data: classIdsResponse } = await getApi('class');
  // Convert response into classId param
  const classIds = classIdsResponse.reduce((acc, current) => acc += `,${current}`);
  const { data: classes } = await getApi(`class/${classIds}`);
  // Map the result into a list of iconNames
  const classIconNames = classes.map(c => c.icon);
  // Download all the images and throw an error if any of the promises fail
  return Promise.all(classIconNames.map(iconName => downloadIcon('class', iconName)))
  .then(iconStatuses => {
    console.log(`Imported ${iconStatuses.length} class images successfully`);
  }).catch(error => {
    console.log(error.message);
  });
  
}

// If called directly we just run the import
if (require.main === module) {
  importClasses();
}

export default importClasses;