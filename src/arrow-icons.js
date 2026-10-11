import './arrow-icons.css';
// Vector paths never fall back to a platform emoji font.
const paths={'↗':'M5 19 19 5M5 5h14v14','↘':'M5 5l14 14M5 19h14V5','↙':'M19 5 5 19M5 5v14h14','↖':'M19 19 5 5M5 19V5h14','←':'M20 12H4m7-7-7 7 7 7','→':'M4 12h16m-7-7 7 7-7 7','↓':'M12 4v16m-7-7 7 7 7-7','↑':'M12 20V4m-7 7 7-7 7 7','↔':'M4 12h16M9 7l-5 5 5 5m6-10 5 5-5 5'};
const aliases={'➡':'→','➜':'→','➔':'→','⬅':'←','⬆':'↑','⬇':'↓','⬈':'↗','⬊':'↘','⬋':'↙','⬉':'↖'};
const arrows=/([↗↘↙↖←→↓↑↔➡➜➔⬅⬆⬇⬈⬊⬋⬉][\uFE0E\uFE0F]?)/;
const replace = root => {
 root.querySelectorAll('.feedback-arrow,.contact-pill > span,.career-role > b,.insight-entry-copy a > b,.service-stream-group > b').forEach(holder=>{
  if(holder.querySelector('svg'))return;
  holder.classList.add('svg-arrow-holder');
  holder.setAttribute('aria-hidden','true');
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.classList.add('vector-arrow');
  const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths['↗']);svg.append(path);holder.append(svg);
 });
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
 while(walker.nextNode()){const node=walker.currentNode;if(arrows.test(node.nodeValue)&&!node.parentElement.closest('script,style,svg,textarea,input,[contenteditable="true"]'))nodes.push(node);}
 nodes.forEach(node=>{
  const fragment=document.createDocumentFragment();
  node.nodeValue.split(arrows).forEach(part=>{
   const symbol=part.replace(/[\uFE0E\uFE0F]/g,'');
   const key=aliases[symbol]||symbol;
   if(!paths[key]){fragment.append(document.createTextNode(part));return;}
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.classList.add('vector-arrow');
   const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[key]);svg.append(path);fragment.append(svg);
  });node.replaceWith(fragment);
 });
};
replace(document.body);
let queued=false;
new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;replace(document.body);});}).observe(document.body,{childList:true,subtree:true,characterData:true});
