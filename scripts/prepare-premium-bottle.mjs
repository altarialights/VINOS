import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
const loadDependency = createRequire(import.meta.resolve('astro/package.json'));
const sharp = loadDependency('sharp');
const assets = JSON.parse(await readFile('src/data/assets.json','utf8'));
for(const [variant,width] of [['desktop',1024],['mobile',640]]) {
 const path = `assets/nexus/nexus-crianza-premium-${variant}.webp`;
 const info = await sharp('design/nexus/nexus-crianza-premium-master.png').resize({width}).webp({quality:93}).toFile('public/'+path);
 Object.assign(assets.find(a=>a.name==='nexus-crianza'&&a.variant===variant),{path,width:info.width,height:info.height,alpha:false});
}
await writeFile('src/data/assets.json',JSON.stringify(assets,null,2));
