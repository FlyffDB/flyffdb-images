import { getApi, downloadIcon } from '../lib';

const importNPCs = async () => {
  console.log("Importing npc images...")
  const { data: npcIdsResponse } = await getApi('npc');
  // Convert npcIds into query strings with a length of 20 
  let groupedIds = [];
  for (let i = 0; i < npcIdsResponse.length; i += 20) {
    let slicedResponse = npcIdsResponse.slice(i, i + 20);
    if (slicedResponse.length > 0) groupedIds.push(slicedResponse.reduce((acc, current) => acc += `,${current}`));
  }
  // Map npc ids to image names
  let npcIconNames = [];
  for (let npcIds of groupedIds) {
    const { data: currentNpcs} = await getApi(`npc/${npcIds}`);
    npcIconNames = npcIconNames.concat(currentNpcs.flatMap(n => {
      return (n.image) ? n.image : [];
    }));
  }
  // Download all the images and throw an error if any of the promises fail
  return Promise.all(npcIconNames.map(iconName => downloadIcon('npc', iconName)))
  .then(iconStatuses => { 
    console.log(`Imported ${iconStatuses.length} npc images successfully`);
  }).catch(error => {
    console.log(error.message);
  });  
}

// If called directly we just run the import
if (require.main === module) {
  importNPCs();
}

export default importNPCs;