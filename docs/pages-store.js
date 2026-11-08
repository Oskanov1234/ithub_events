/* IThub Events — browser-only demonstration store. No server, no access control, no real participant records. */
const DATA_KEY='ithub-events-pages-demo-v1';
const SESSION_KEY='ithub-events-pages-demo-access-v1';
const CHANGED_KEY='ithub-events-pages-demo-updated';
const today=()=>new Date().toISOString();
export const escapeHTML = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const formatDate = iso => iso ? new Date(iso).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Moscow'}) : 'Дата не указана';
export const formatDateTime = iso => iso ? new Date(iso).toLocaleString('ru-RU',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Moscow'}) : 'Дата не указана';
export const demoAdmin={email:'demo@ithub-events.test',password:'Demo2026!'};
export const defaultData=()=>({version:1,events:[{
 id:1001,title:'ДЕМО · Презентация проектов IThub Events',slug:'demo-presentation',
 category:'Презентация',description:'Тестовый черновик для проверки админ-панели. Это вымышленное мероприятие и оно не публикуется без действия пользователя.',
 location:'Демо — место будет уточнено',starts_at:'2027-02-20T13:00:00+03:00',ends_at:'2027-02-20T15:00:00+03:00',
 capacity:30,status:'draft',created_at:today(),updated_at:today(),image_url:'',program:'Знакомство с проектом и демонстрация интерфейса.',conditions:'Для демонстрации, запись недоступна.'
 }],registrations:[
 {id:1,event_id:1001,first_name:'Тест',last_name:'Участник',email:'participant1@example.test',student_group:'ДЕМО',status:'submitted',created_at:today()},
 {id:2,event_id:1001,first_name:'Пример',last_name:'Студент',email:'participant2@example.test',student_group:'ДЕМО',status:'confirmed',created_at:today()}
 ]});
const isValid = x => x && Array.isArray(x.events) && Array.isArray(x.registrations) && x.version===1;
export function readData(){
 try{const v=localStorage.getItem(DATA_KEY);if(v){const x=JSON.parse(v);if(isValid(x))return x;}}catch(e){console.warn('Local demo unavailable',e);}
 return defaultData();
}
export function saveData(x){if(!isValid(x))throw Error('Неверная структура демонстрационных данных.');try{localStorage.setItem(DATA_KEY,JSON.stringify(x));localStorage.setItem(CHANGED_KEY,String(Date.now()));}catch(e){throw Error('Не удалось сохранить данные в браузере. Проверьте доступ к localStorage и свободное место.');}window.dispatchEvent(new Event('ithub-events-update'));}
export function resetData(){const x=defaultData();saveData(x);return x;}
export function isDemoLoggedIn(){try{return sessionStorage.getItem(SESSION_KEY)==='yes';}catch{return false;}}
export function loginDemo(email,password){if(String(email||'').trim().toLowerCase()!==demoAdmin.email||password!==demoAdmin.password)return false;try{sessionStorage.setItem(SESSION_KEY,'yes');}catch{return false;}return true;}
export function logoutDemo(){try{sessionStorage.removeItem(SESSION_KEY);}catch{}}
export function nextId(records){return Math.max(1000,...records.map(x=>Number(x.id)||0))+1;}
export function exportedData(){return JSON.stringify(readData(),null,2);}
export function importData(str){const v=JSON.parse(str);if(!isValid(v)||v.events.length>500||v.registrations.length>2000)throw Error('Некорректный JSON. Нужна демонстрационная структура IThub Events.');saveData(v);return v;}
export function downloadText(name,text,type='text/plain;charset=utf-8'){const blob=new Blob([text],{type});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),2000);}
