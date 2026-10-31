(()=>{'use strict';
const TARGET='languageSelect';
let loaded=false;
function googleReady(){return !!document.querySelector('.goog-te-combo')}
function drive(lang){const combo=document.querySelector('.goog-te-combo');if(!combo)return false;combo.value=lang;combo.dispatchEvent(new Event('change',{bubbles:true}));return true}
function load(){if(loaded)return;loaded=true;const holder=document.createElement('div');holder.id='hb-google-translate-element';holder.style.cssText='position:absolute;left:-9999px;top:-9999px';document.body.append(holder);window.googleTranslateElementInit=function(){if(window.google?.translate?.TranslateElement){new window.google.translate.TranslateElement({pageLanguage:'ko',includedLanguages:'ko,en',autoDisplay:false},'hb-google-translate-element');setTimeout(()=>{if(document.getElementById(TARGET)?.value==='en')drive('en')},800)}};const script=document.createElement('script');script.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';script.async=true;script.onerror=()=>console.warn('Google website translation currently unavailable');document.head.append(script)}
function onChange(){const sel=document.getElementById(TARGET);if(!sel)return;const en=sel.value==='en';if(en){load();if(googleReady())drive('en')}else if(googleReady())drive('ko')}
function setup(){const sel=document.getElementById(TARGET);if(!sel||sel.dataset.hbGoogleTranslation)return;sel.dataset.hbGoogleTranslation='1';sel.addEventListener('change',()=>setTimeout(onChange,0));if(sel.value==='en')onChange()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();window.addEventListener('hashchange',()=>{if(document.getElementById(TARGET)?.value==='en'&&googleReady())setTimeout(()=>drive('en'),600)});
})();