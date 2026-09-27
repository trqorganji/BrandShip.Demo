// Vector paths never fall back to a platform emoji font.
const paths={'↗':'M5 19 19 5M5 5h14v14','←':'M20 12H4m7-7-7 7 7 7','→':'M4 12h16m-7-7 7 7-7 7','↓':'M12 4v16m-7-7 7 7 7-7','↑':'M12 20V4m-7 7 7-7 7 7'};
const replace = root => {
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
 while(walker.nextNode()){const node=walker.currentNode;if(/[↗←→↓↑]/.test(node.nodeValue)&&!node.parentElement.closest('script,style,svg,textarea,input'))nodes.push(node);}
 nodes.forEach(node=>{
  const fragment=document.createDocumentFragment();
  node.nodeValue.split(/([↗←→↓↑])/).forEach(part=>{
   if(!paths[part]){fragment.append(document.createTextNode(part));return;}
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.classList.add('vector-arrow');
   const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[part]);svg.append(path);fragment.append(svg);
  });node.replaceWith(fragment);
 });
};
replace(document.body);
let queued=false;
new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;replace(document.body);});}).observe(document.body,{childList:true,subtree:true,characterData:true});
