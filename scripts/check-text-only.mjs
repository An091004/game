import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const decoder=new TextDecoder('utf-8',{fatal:true});
for(const file of files){
 if(file.startsWith('android/'))throw Error('Không được commit thư mục android/: '+file);
 const bytes=readFileSync(file);
 if(bytes.includes(0))throw Error('Phát hiện file nhị phân: '+file);
 try{decoder.decode(bytes);}catch{throw Error('File không phải UTF-8: '+file);}
}
console.log(`Đã kiểm tra ${files.length} file được Git theo dõi: chỉ có văn bản UTF-8.`);
