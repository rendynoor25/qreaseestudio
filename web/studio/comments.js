function commentTargetObjects(id) {
  const group=members(id);
  return group.length?group:objects().filter(object=>object.id===id);
}
/** @param {string} id @returns {string} */
function commentTargetName(id) {
  const group=members(id);
  if (group.length) return group[0].container?.name || 'Grup';
  return objects().find(object=>object.id===id)?.name || 'Objek';
}
/** @param {string} id */
function commentTargetExists(id) {
  return commentTargetObjects(id).length>0;
}

function updateCommentBadge() {
  const button=$('#comments-toggle');
  const all=comments();
  const count=all.filter(comment=>!comment.parent && !comment.resolved).length;
  button.dataset.count=count?String(count):'';
  button.title=count?'Komentar ('+count+' belum selesai)':'Komentar';
}

/** @param {HTMLElement} element @param {QreaseeComment} comment */
function renderCommentText(element,comment) {
  element.replaceChildren();
  const text=comment.text || '';
  const names=(comment.mentions || []).filter(Boolean).sort((a,b)=>b.length-a.length);
  let index=0;
  while (index<text.length) {
    const at=text.indexOf('@',index);
    if (at<0) {element.append(document.createTextNode(text.slice(index)));break;}
    if (at>index) element.append(document.createTextNode(text.slice(index,at)));
    let name=names.find(candidate=>text.startsWith(candidate,at+1));
    if (!name) {
      const token=/^@([^\s@]{1,32})/.exec(text.slice(at));
      if (!token) {element.append(document.createTextNode('@'));index=at+1;continue;}
      name=token[1];
    }
    const mention=document.createElement('span');
    mention.className='comment-mention';
    mention.textContent='@'+name;
    element.append(mention);
    index=at+1+name.length;
  }
  if (!text) element.textContent='';
}

function scrollToCommentTarget(target) {
  const cards=/** @type {HTMLElement[]} */ ([...document.querySelectorAll('#comment-list .comment-card')]);
  const card=cards.find(item=>item.dataset.target===target);
  card?.scrollIntoView({block:'nearest'});
}

function renderComments() {
  updateCommentBadge();
  const list=$('#comment-list');
  if (!list) return;
  list.replaceChildren();
  const all=comments();
  const items=all.filter(comment=>!comment.parent || !all.some(item=>item.id===comment.parent))
    .sort((a,b)=>Number(Boolean(a.resolved))-Number(Boolean(b.resolved)) ||
      b.created_at-a.created_at);
  if (!items.length) {
    const empty=document.createElement('div');
    empty.className='comment-empty';
    empty.textContent='Belum ada komentar. Klik kanan objek, Group, atau Component lalu pilih Komentar.';
    list.append(empty);
    return;
  }
  const buildCard=(comment,parent)=>{
    const card=document.createElement('article');
    card.className='comment-card'+(parent?' comment-reply':'')+
      (comment.resolved?' resolved':'')+
      (!parent && activeCommentTarget===comment.target?' active':'');
    card.dataset.target=comment.target;
    const head=document.createElement('div');head.className='comment-card-head';
    const avatar=document.createElement('span');avatar.className='comment-avatar';
    avatar.textContent=commentInitials(comment.author);
    const meta=document.createElement('div');meta.className='comment-meta';
    const author=document.createElement('strong');author.textContent=comment.author;
    const time=document.createElement('small');time.textContent=commentTime(comment.created_at);
    meta.append(author,time);
    head.append(avatar,meta);
    if (parent) {
      const tag=document.createElement('span');tag.className='comment-reply-tag';tag.textContent='Balasan';
      head.append(tag);
    } else {
      const target=document.createElement('button');target.type='button';target.className='comment-target';
      target.textContent=commentTargetName(comment.target);
      target.title='Pilih '+commentTargetName(comment.target);
      target.onclick=event=>{event.stopPropagation();focusCommentTarget(comment.target);};
      head.append(target);
    }
    const text=document.createElement('div');text.className='comment-text';
    renderCommentText(text,comment);
    card.append(head,text);
    if (comment.resolved) {
      const done=document.createElement('span');done.className='comment-resolved-tag';
      done.textContent='Selesai';
      card.append(done);
    }
    const foot=document.createElement('div');foot.className='comment-card-foot';
    if (!parent) {
      const reply=document.createElement('button');reply.type='button';reply.className='comment-action';
      reply.textContent='Balas';
      reply.disabled=!canComment();
      reply.onclick=event=>{event.stopPropagation();
        openCommentComposer(comment.target,event.clientX,event.clientY,comment);};
      const resolve=document.createElement('button');resolve.type='button';resolve.className='comment-action';
      resolve.textContent=comment.resolved?'Buka lagi':'Selesaikan';
      resolve.disabled=!canComment();
      resolve.onclick=event=>{event.stopPropagation();toggleCommentResolved(comment);};
      foot.append(reply,resolve);
    }
    const remove=document.createElement('button');remove.type='button';remove.className='comment-delete';
    remove.textContent='Hapus';
    remove.disabled=!canComment();
    remove.onclick=event=>{event.stopPropagation();deleteComment(comment);};
    foot.append(remove);
    card.append(foot);
    card.onclick=()=>focusCommentTarget(comment.target);
    return card;
  };
  for (const comment of items) {
    const card=buildCard(comment,false);
    const replies=all.filter(item=>item.parent===comment.id)
      .sort((a,b)=>a.created_at-b.created_at);
    if (replies.length) {
      const thread=document.createElement('div');thread.className='comment-replies';
      for (const reply of replies) thread.append(buildCard(reply,true));
      card.append(thread);
    }
    list.append(card);
  }
  if (activeCommentTarget) scrollToCommentTarget(activeCommentTarget);
}

/** @param {string} target */
function focusCommentTarget(target) {
  if (!commentTargetExists(target)) return;
  activeCommentTarget=target;
  renderComments();
  select(target);
  toggleComments(true);
  scrollToCommentTarget(target);
}

/** @param {boolean=} force */
function toggleComments(force) {
  const panel=$('#comments-panel');
  const open=force===undefined?panel.hidden:force;
  panel.hidden=!open;
  $('#comments-toggle').setAttribute('aria-expanded',String(open));
  if (open) {
    $('#sections-panel').hidden=true;
    $('#sections-toggle').setAttribute('aria-expanded','false');
    renderComments();
  }
}

/** @param {number} clientX @param {number} clientY */
function positionCommentComposer(clientX,clientY) {
  const stage=$('#model-stage');
  const composer=$('#comment-composer');
  const stageBox=stage.getBoundingClientRect();
  const box=composer.getBoundingClientRect();
  let left=clientX-stageBox.left-box.width-18;
  if (left<12 || left+box.width>stageBox.width-12)
    left=clientX-stageBox.left+18;
  left=clamp(left,8,Math.max(8,stageBox.width-box.width-8));
  const top=clamp(clientY-stageBox.top-18,58,Math.max(58,stageBox.height-box.height-12));
  composer.style.left=left+'px';
  composer.style.top=top+'px';
}

/** @param {string} target @param {number=} clientX @param {number=} clientY @param {QreaseeComment=} replyTo */
function openCommentComposer(target,clientX,clientY,replyTo) {
  if (!canComment()) {showStatus('Akses ini hanya dapat melihat proyek.');return;}
  if (!commentTargetExists(target)) {showStatus('Objek target sudah tidak ada.');return;}
  commentComposerTarget=target;
  commentComposerReplyTo=replyTo || null;
  commentComposerPoint={x:clientX??canvas.getBoundingClientRect().left+80,
    y:clientY??canvas.getBoundingClientRect().top+120};
  activeCommentTarget=target;
  commentDraftMentions.clear();
  $('#comment-text').value='';
  $('#comment-compose-status').textContent='';
  $('#comment-composer-title').textContent=commentComposerReplyTo?'Balas komentar':'Tambah komentar';
  $('#comment-target-name').textContent=commentComposerReplyTo
    ? 'Untuk '+commentTargetName(target)+' · balasan untuk '+commentComposerReplyTo.author
    : commentTargetName(target);
  $('#comment-mentions').hidden=true;
  $('#comment-mentions').replaceChildren();
  const composer=$('#comment-composer');
  composer.hidden=false;
  positionCommentComposer(commentComposerPoint.x,commentComposerPoint.y);
  select(target);
  toggleComments(true);
  renderComments();
  $('#comment-text').focus({preventScroll:true});
}

function closeCommentComposer() {
  $('#comment-composer').hidden=true;
  $('#comment-mentions').hidden=true;
  $('#comment-text').value='';
  $('#comment-compose-status').textContent='';
  commentComposerTarget=null;
  commentComposerReplyTo=null;
  commentDraftMentions.clear();
}

/** @returns {{start:number,query:string}|null} */
function commentMentionMatch() {
  const input=$('#comment-text');
  const caret=input.selectionStart??input.value.length;
  const before=input.value.slice(0,caret);
  const match=/(?:^|\s)@([^\s@]*)$/.exec(before);
  if (!match) return null;
  return {start:caret-match[1].length-1,query:match[1]};
}

/** @returns {string[]} */
function commentMentionPeople() {
  const names=[...state.peers.map(peer=>peer.name),...comments().map(comment=>comment.author),state.name];
  return [...new Set(names.filter(name=>name && name!==state.name))].slice(0,12);
}

function renderCommentMentions() {
  const box=$('#comment-mentions');
  const match=commentMentionMatch();
  if (!match) {
    box.hidden=true;box.replaceChildren();
    if (commentComposerPoint) positionCommentComposer(commentComposerPoint.x,commentComposerPoint.y);
    return;
  }
  const query=match.query.toLowerCase();
  const people=commentMentionPeople().filter(name=>name.toLowerCase().includes(query));
  if (!people.length) {
    box.hidden=true;box.replaceChildren();
    if (commentComposerPoint) positionCommentComposer(commentComposerPoint.x,commentComposerPoint.y);
    return;
  }
  box.replaceChildren();
  box.hidden=false;
  for (const name of people) {
    const option=document.createElement('button');
    option.type='button';
    option.className='comment-mention-option';
    const avatar=document.createElement('span');avatar.className='comment-avatar';
    avatar.textContent=commentInitials(name);
    const label=document.createElement('span');label.textContent=name;
    option.append(avatar,label);
    option.onmousedown=event=>event.preventDefault();
    option.onclick=()=>insertCommentMention(name);
    box.append(option);
  }
  if (commentComposerPoint) positionCommentComposer(commentComposerPoint.x,commentComposerPoint.y);
}

/** @param {string} name */
function insertCommentMention(name) {
  const input=$('#comment-text');
  const caret=input.selectionStart??input.value.length;
  const before=input.value.slice(0,caret);
  const at=before.lastIndexOf('@');
  if (at<0) return;
  const after=input.value.slice(caret);
  input.value=before.slice(0,at)+'@'+name+' '+after;
  const position=at+name.length+2;
  input.setSelectionRange(position,position);
  commentDraftMentions.add(name);
  renderCommentMentions();
  input.focus({preventScroll:true});
}

async function submitComment() {
  if (!canComment()) {showStatus('Akses ini hanya dapat melihat proyek.');return;}
  const input=$('#comment-text');
  const text=input.value.trim();
  if (!text) {$('#comment-compose-status').textContent='Tulis komentar terlebih dahulu.';return;}
  if (!commentComposerTarget || !commentTargetExists(commentComposerTarget)) {
    $('#comment-compose-status').textContent='Objek target sudah tidak ada.';
    return;
  }
  const known=commentMentionPeople();
  const mentions=[...new Set([...commentDraftMentions,...known])]
    .filter(name=>text.includes('@'+name));
  const button=$('#comment-send');
  button.disabled=true;
  $('#comment-compose-status').textContent='Mengirim…';
  const saved=await commit({
    type:'comment',before:null,
    after:{id:identity(),target:commentComposerTarget,author:state.name,text:text.slice(0,1000),
      created_at:Date.now(),mentions,
      ...(commentComposerReplyTo?{parent:commentComposerReplyTo.id}:{})}
  });
  button.disabled=false;
  if (saved) {
    closeCommentComposer();
    showStatus('Komentar ditambahkan.');
  } else $('#comment-compose-status').textContent='Komentar gagal dikirim.';
}

/** @param {QreaseeComment} comment */
async function deleteComment(comment) {
  if (!canComment()) {showStatus('Akses ini hanya dapat melihat proyek.');return;}
  if (!window.confirm('Hapus komentar dari '+comment.author+'?')) return;
  const saved=await commit({type:'comment',before:comment,after:null});
  if (saved) showStatus('Komentar dihapus.');
}

/** @param {QreaseeComment} comment */
async function toggleCommentResolved(comment) {
  if (!canComment()) {showStatus('Akses ini hanya dapat melihat proyek.');return;}
  const resolved=!comment.resolved;
  const saved=await commit({type:'comment',before:comment,
    after:{...comment,resolved}});
  if (saved) showStatus(resolved?'Komentar ditandai selesai.':'Komentar dibuka lagi.');
}

/** @param {number} clientX @param {number} clientY */
function placeObjectMenu(clientX,clientY) {
  const menu=$('#object-menu');
  menu.hidden=false;
  const box=menu.getBoundingClientRect();
  menu.style.left=clamp(clientX,8,window.innerWidth-box.width-8)+'px';
  menu.style.top=clamp(clientY,8,window.innerHeight-box.height-8)+'px';
}

function showObjectMenu(target,clientX,clientY) {
  objectMenuTarget=target;
  objectMenuPoint={x:clientX,y:clientY};
  objectMenuSection=null;
  const group=members(target);
  const kind=group.length?(group[0].container?.definition?'Component':'Group'):'Objek';
  $('#object-menu-title').textContent=kind+' · '+commentTargetName(target);
  const commentButton=$('#object-menu-comment');
  commentButton.hidden=false;
  commentButton.disabled=!canComment();
  commentButton.title=canComment()?'Tambah komentar':'Akses ini hanya dapat melihat proyek.';
  for (const id of SECTION_MENU_IDS) $('#'+id).hidden=true;
  const hideButton=$('#object-menu-hide');
  const allHidden=commentTargetObjects(target).filter(object=>object.shape!=='line')
    .every(object=>object.hidden);
  hideButton.hidden=false;
  hideButton.textContent=allHidden?'Tampilkan objek':'Sembunyikan objek';
  hideButton.disabled=!canEditModel();
  placeObjectMenu(clientX,clientY);
}

function showSectionMenu(section,clientX,clientY) {
  objectMenuTarget=null;
  objectMenuPoint=null;
  objectMenuSection=section;
  activeSectionId=section.id;
  $('#object-menu-title').textContent='Bidang potong '+(section.symbol||'');
  $('#object-menu-comment').hidden=true;
  $('#object-menu-hide').hidden=true;
  for (const id of SECTION_MENU_IDS) {
    const button=$('#'+id);
    button.hidden=false;
    button.disabled=!canEditModel();
  }
  $('#object-menu-section-hide').textContent=section.hidden?'Tampilkan bidang':'Sembunyikan bidang';
  renderSections();
  placeObjectMenu(clientX,clientY);
  redraw();
}

function hideObjectMenu() {
  $('#object-menu').hidden=true;
  $('#object-menu-comment').hidden=false;
  for (const id of SECTION_MENU_IDS) $('#'+id).hidden=true;
  $('#object-menu-hide').hidden=true;
  objectMenuTarget=null;
  objectMenuPoint=null;
  objectMenuSection=null;
}

/** @param {string} target */
function commentTargetBox(target) {
  let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
  for (const face of state.hits) {
    if (targetId(face.object)!==target) continue;
    for (const [x,y] of face.points) {
      if (!Number.isFinite(x)||!Number.isFinite(y)) continue;
      left=Math.min(left,x);right=Math.max(right,x);
      top=Math.min(top,y);bottom=Math.max(bottom,y);
    }
  }
  return Number.isFinite(left)?{left,top,right,bottom}:null;
}

function drawCommentPins() {
  commentPins=[];
  const counts=new Map();
  for (const comment of comments()) {
    if (comment.parent || comment.resolved) continue;
    counts.set(comment.target,(counts.get(comment.target)||0)+1);
  }
  if (!counts.size) return;
  ctx.save();
  ctx.font='bold 10px Segoe UI, sans-serif';
  for (const [target,count] of counts) {
    const box=commentTargetBox(target);
    if (!box) continue;
    const label=String(count);
    const width=30+Math.max(0,label.length-1)*6,height=21;
    const x=clamp(box.left-width-8,4,canvas.clientWidth-width-4);
    const y=clamp((box.top+box.bottom)/2-height/2,4,canvas.clientHeight-height-4);
    ctx.shadowColor='#1b2b3a45';
    ctx.shadowBlur=10;
    ctx.shadowOffsetY=3;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x,y,width,height,10);
    else ctx.rect(x,y,width,height);
    ctx.fillStyle='#fffdf8';ctx.fill();
    ctx.shadowColor='transparent';
    ctx.strokeStyle=activeCommentTarget===target?'#d27a2b':'#d9c7b1';
    ctx.lineWidth=activeCommentTarget===target?1.7:1;
    ctx.stroke();
    ctx.strokeStyle='#b46a2b';ctx.lineWidth=1.2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x+6,y+6,10,8,2);
    else ctx.rect(x+6,y+6,10,8);
    ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+9,y+14);ctx.lineTo(x+8,y+17);ctx.lineTo(x+12,y+14);
    ctx.stroke();
    ctx.fillStyle='#7c4a1c';
    ctx.fillText(label,x+20,y+15);
    commentPins.push({target,x,y,width,height,count});
  }
  ctx.restore();
}

/** @param {QreaseePoint2} point */
function commentPinAt(point) {
  return commentPins.find(pin=>point[0]>=pin.x-2&&point[0]<=pin.x+pin.width+2&&
    point[1]>=pin.y-2&&point[1]<=pin.y+pin.height+2) || null;
}

$('#comments-toggle').onclick=()=>toggleComments($('#comments-panel').hidden);
$('#comments-close').onclick=()=>toggleComments(false);
$('#sections-toggle').onclick=()=>toggleSections($('#sections-panel').hidden);
$('#sections-close').onclick=()=>toggleSections(false);
$('#hidden-toggle').onclick=()=>setHiddenMode(!state.showHidden);
$('#section-add').onclick=()=>{
  setTool('section');
  toggleSections(false);
  showStatus('Klik sebuah bidang pada model untuk menempatkan bidang potong.');
};
$('#comment-cancel').onclick=closeCommentComposer;
$('#comment-send').onclick=submitComment;
$('#comment-text').addEventListener('input',renderCommentMentions);
$('#comment-text').addEventListener('keydown',event=>{
  if (event.key==='Enter' && (event.ctrlKey||event.metaKey)) {
    event.preventDefault();event.stopPropagation();submitComment();return;
  }
  if (event.key==='Escape') {event.preventDefault();event.stopPropagation();closeCommentComposer();}
});
$('#object-menu-comment').onclick=()=>{
  const target=objectMenuTarget;
  const point=objectMenuPoint;
  hideObjectMenu();
  if (target) openCommentComposer(target,point?.x,point?.y);
};
$('#object-menu-section-move').onclick=()=>{
  const section=objectMenuSection;
  hideObjectMenu();
  if (section) beginSectionMove(section);
};
$('#object-menu-section-flip').onclick=()=>{
  const section=objectMenuSection;
  hideObjectMenu();
  if (section) updateSection(section,
    {normal:[-section.normal[0],-section.normal[1],-section.normal[2]]});
};
$('#object-menu-section-hide').onclick=()=>{
  const section=objectMenuSection;
  hideObjectMenu();
  if (section) updateSection(section,{hidden:!section.hidden});
};
$('#object-menu-hide').onclick=()=>{
  const target=objectMenuTarget;
  hideObjectMenu();
  if (target) toggleHideTarget(target);
};
$('#object-menu-section-delete').onclick=()=>{
  const section=objectMenuSection;
  hideObjectMenu();
  if (section) removeSection(section);
};
window.addEventListener('pointerdown',event=>{
  if (!$('#object-menu').hidden && !$('#object-menu').contains(/** @type {Node} */ (event.target)))
    hideObjectMenu();
});
