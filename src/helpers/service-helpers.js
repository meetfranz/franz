import path from 'path';
import { remote } from 'electron';
import fs from 'fs-extra';

const app = remote.app;

function getServicePartitionsDirectory() {
  return path.join(app.getPath('userData'), 'Partitions');
}

export function removeServicePartitionDirectory(id = '') {
  const servicePartition = path.join(getServicePartitionsDirectory(), `service-${id}`);
  return fs.remove(servicePartition);
}

export async function getServiceIdsFromPartitions() {
  const files = await fs.readdir(getServicePartitionsDirectory());
  return files.map(filename => filename.replace('service-', ''));
}
