const KEY='ithub-events-demo-theme';
let theme='light';
try { theme=localStorage.getItem(KEY)|| (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}catch{}
function applyTheme(next){theme=next==='dark'?'dark':'light';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;document.querySelectorAll('.theme-toggle').forEach(b=>{b.textContent=theme==='dark'?'☀':'☾';b.setAttribute('aria-label',theme==='dark'?'Светлая тема':'Тёмная тема');b.setAttribute('aria-pressed',String(theme==='dark'));});document.querySelectorAll('.brand-mark').forEach(img=>img.src=theme==='dark'?'./brand/ithub-logo-white.png':'./brand/ithub-logo.png');}
window.ITHUBTheme={bind(){applyTheme(theme);document.querySelectorAll('.theme-toggle').forEach(b=>b.onclick=()=>{let n=theme==='dark'?'light':'dark';try{localStorage.setItem(KEY,n)}catch{}applyTheme(n);});}};
applyTheme(theme);
