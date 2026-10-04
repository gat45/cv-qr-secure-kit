import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
const iterations = 310000, sourceDir = 'private-source', vaultDir = 'vault';
const mime = { '.pdf':'application/pdf','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png' };
const rl = createInterface({ input, output }); const password = await rl.question('Mot de passe du coffre : '); await rl.close();
if (password.length < 10) throw new Error('Mot de passe trop court.');
function crypt(data) { const salt=randomBytes(16),iv=randomBytes(12),key=pbkdf2Sync(password,salt,iterations,32,'sha256'),cipher=createCipheriv('aes-256-gcm',key,iv),dataOut=Buffer.concat([cipher.update(data),cipher.final()]); return Buffer.concat([salt,iv,dataOut,cipher.getAuthTag()]); }
const files=(await readdir(sourceDir,{withFileTypes:true})).filter(f=>f.isFile()); if(!files.length) throw new Error('Aucun document dans private-source/.');
await rm(vaultDir,{recursive:true,force:true}); await mkdir(vaultDir,{recursive:true}); const documents=[];
for (const [i,file] of files.entries()) { const ext=extname(file.name).toLowerCase(), encrypted=`document-${String(i+1).padStart(3,'0')}.enc`; await writeFile(join(vaultDir,encrypted),crypt(await readFile(join(sourceDir,file.name)))); documents.push({label:basename(file.name,ext),file:encrypted,type:mime[ext]??'application/octet-stream'}); }
await writeFile(join(vaultDir,'manifest.enc'),crypt(Buffer.from(JSON.stringify({version:1,documents})))); console.log(`${files.length} document(s) chiffré(s).`);
