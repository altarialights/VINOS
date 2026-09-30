import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
const loadAstroDependency = createRequire(import.meta.resolve('astro/package.json'));
const sharp = loadAstroDependency('sharp');
const manifest = [];
for (const [name, source] of [['vineyard','design/nexus/vineyard-master.png'],['tempranillo','design/nexus/tempranillo-master.png'],['tasting','design/nexus/tasting-master.png'],['nexus-crianza','public/assets/nexus/nexus-crianza-official.png'],['frontaura-crianza','public/assets/nexus/frontaura-crianza-official.png'],['aponte-reserva','public/assets/nexus/aponte-reserva-official.png']]) {
  const meta = await sharp(source).metadata();
  for (const [variant, width] of [['desktop',meta.width],['mobile',640]]) {
    const path = `assets/nexus/${name}-${variant}.webp`;
    const info = await sharp(source).resize({width,withoutEnlargement:true}).webp({quality:88,alphaQuality:100}).toFile('public/'+path);
    manifest.push({name,variant,path,width:info.width,height:info.height,alpha:meta.hasAlpha});
    console.log(path,info.size,meta.hasAlpha);
  }
}
await writeFile('src/data/assets.json',JSON.stringify(manifest,null,2));
