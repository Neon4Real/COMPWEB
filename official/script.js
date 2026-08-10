const originalHero=document.querySelector('.hero');
if(originalHero){
  const poster=originalHero.querySelector('.hero-media img')?.getAttribute('src')||'';
  originalHero.classList.add('cinematic-hero');
  originalHero.style.setProperty('--hero-poster',`url("${poster}")`);
  originalHero.innerHTML=`
    <video class="cinematic-video" autoplay muted loop playsinline preload="metadata" aria-hidden="true">
      <source src="https://videos.pexels.com/video-files/30518582/13075117_1920_1080_30fps.mp4" type="video/mp4">
    </video>
    <div class="gaming-grid" aria-hidden="true"></div>
    <div class="gaming-light green" aria-hidden="true"></div>
    <div class="gaming-light red" aria-hidden="true"></div>
    <div class="cinematic-content">
      <p class="esports-kicker">Mobile phones · accessories · gaming rigs · repairs</p>
      <div class="hero-liveworld-logo" aria-label="Live World Electronics Trading LLC">
        <span class="lw-symbol">LW</span>
        <span><strong>LIVE WORLD</strong><small>ELECTRONICS TRADING LLC</small></span>
      </div>
      <h1 class="cinematic-title"><span>Unlock your</span>digital dreams.</h1>
      <p class="hero-system-copy">Competitive gaming PCs, performance laptops, esports peripherals and expert technical support—built around the way you play.</p>
    </div>
    <span class="hero-scroll-cue" aria-hidden="true">Scroll to explore<i></i></span>`;

  const heroVideo=originalHero.querySelector('.cinematic-video');
  heroVideo.poster=poster;
  heroVideo.addEventListener('canplay',()=>originalHero.classList.add('video-ready'),{once:true});
  heroVideo.addEventListener('error',()=>originalHero.classList.add('video-failed'),{once:true});
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)heroVideo.pause();
  else heroVideo.play().catch(()=>{});
}

const scrollAmbient=document.createElement('div');
scrollAmbient.className='scroll-ambient';
scrollAmbient.setAttribute('aria-hidden','true');
scrollAmbient.innerHTML='<span class="ambient-orb"></span><span class="ambient-orb"></span>';
document.body.append(scrollAmbient);

const ambientSections=[
  ['.cinematic-hero','gaming'],
  ['.products','phones'],
  ['.repair-section','repair'],
  ['.delivery-band','gaming'],
  ['.concierge-section','service'],
  ['.reviews-section','reviews'],
  ['.payment-experience','payments'],
  ['.visit-section','locations']
].map(([selector,theme])=>({element:document.querySelector(selector),theme})).filter(item=>item.element);

let ambientFrame=0;
const updateScrollExperience=()=>{
  ambientFrame=0;
  if(originalHero){
    const heroRect=originalHero.getBoundingClientRect();
    const heroProgress=Math.max(0,Math.min(1,-heroRect.top/(heroRect.height*.82)));
    originalHero.style.setProperty('--hero-scroll',heroProgress.toFixed(3));
  }
  const focus=window.innerHeight*.48;
  const active=ambientSections.reduce((nearest,item)=>{
    const rect=item.element.getBoundingClientRect();
    const distance=Math.abs(rect.top+Math.min(rect.height,window.innerHeight)*.5-focus);
    return !nearest||distance<nearest.distance?{...item,distance}:nearest;
  },null);
  if(active)document.body.dataset.ambient=active.theme;
};
const scheduleAmbient=()=>{
  if(!ambientFrame)ambientFrame=requestAnimationFrame(updateScrollExperience);
};
window.addEventListener('scroll',scheduleAmbient,{passive:true});
window.addEventListener('resize',scheduleAmbient,{passive:true});
updateScrollExperience();

const branchButtons=[...document.querySelectorAll('.branch-switcher button')];
const branchMap=document.querySelector('.map-card iframe');
const branchMapCard=document.querySelector('.map-card');
const visitHeading=document.querySelector('.visit-copy h2');
const visitAddress=document.querySelector('.visit-copy address');
const branchLocations=[
  {
    name:'Muhaisnah 4',
    address:['Shop No. 1, Mango Hypermarket Building','Muhaisnah 4, near Lulu Village','Dubai, UAE'],
    query:'Live World Hub Electronics LLC Muhaisnah 4 Dubai'
  },
  {
    name:'Al Warqaa 1',
    address:['Q1 Mall, Al Warqaa 1 Street','Ground Floor','Dubai, UAE'],
    query:'Live World Electronics Q1 Mall Al Warqaa 1 Dubai'
  },
  {
    name:'Mirdif',
    address:['Near Abaya Mall','Mirdif','Dubai, UAE'],
    query:'Live World Electronics near Abaya Mall Mirdif Dubai'
  },
  {
    name:'Oud Al Muteena',
    address:['Emirates Co-operative Society','Oud Al Muteena 1','Dubai, UAE'],
    query:'Live World Electronics Emirates Cooperative Society Oud Al Muteena 1 Dubai'
  },
  {
    name:'Al Khawaneej',
    address:['Live World Electronics','Al Khawaneej','Dubai, UAE'],
    query:'Live World Electronics Al Khawaneej Dubai'
  }
];

const selectBranch=index=>{
  const branch=branchLocations[index];
  if(!branch||!branchMap)return;
  branchButtons.forEach((button,buttonIndex)=>{
    const selected=buttonIndex===index;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
  visitHeading.innerHTML=`${branch.name},<br>Dubai.`;
  visitAddress.innerHTML=branch.address.join('<br>');
  branchMap.title=`Google Map showing ${branch.name} branch`;
  branchMapCard.classList.add('is-switching');
  branchMap.src=`https://www.google.com/maps?q=${encodeURIComponent(branch.query)}&output=embed`;
};

branchMap?.addEventListener('load',()=>branchMapCard.classList.remove('is-switching'));
branchButtons.forEach((button,index)=>button.addEventListener('click',()=>selectBranch(index)));
branchButtons.forEach((button,index)=>button.setAttribute('aria-pressed',String(index===0)));

const form=document.querySelector('.concierge-form');
const buttons=[...document.querySelectorAll('.form-tabs button')];
const formTitle=document.querySelector('.form-heading h3');
const formCopy=document.querySelector('.form-heading p');
const serviceSelect=form?.querySelector('[name="service"]');
const remarksField=form?.querySelector('[name="remarks"]');
const serviceLabel=serviceSelect?.closest('label');
const remarksLabel=remarksField?.closest('label');
const submitButton=form?.querySelector('button[type="submit"]');
let mode='repair';

const formModes={
  repair:{
    title:'Service or repair booking',
    copy:'Enter the device and complaint details below.',
    serviceLabel:'Service required',
    servicePlaceholder:'Select service',
    services:['Device diagnosis','Screen repair','Battery or charging','No power or no display','Software or data','Cleaning or overheating','Upgrade or custom build','Other'],
    remarksLabel:'Remarks / complaint',
    remarksPlaceholder:'Describe the issue, damage or symptoms',
    submit:'Continue on WhatsApp'
  },
  quote:{
    title:'Phone quotation',
    copy:'Tell us the phone brand, model, colour and storage you need.',
    serviceLabel:'Quotation type',
    servicePlaceholder:'Select request',
    services:['New phone price and availability','Trade-in enquiry','Phone accessories','Business or bulk purchase','Other'],
    remarksLabel:'Colour, storage & requirements',
    remarksPlaceholder:'Example: Natural Titanium, 256 GB, UAE version',
    submit:'Request quote on WhatsApp'
  }
};

const setLabelText=(label,text)=>{
  const textNode=[...label.childNodes].find(node=>node.nodeType===Node.TEXT_NODE);
  if(textNode)textNode.nodeValue=text;
};

const setSubmitText=text=>{
  const textNode=[...submitButton.childNodes].find(node=>node.nodeType===Node.TEXT_NODE&&node.nodeValue.trim());
  if(textNode)textNode.nodeValue=` ${text} `;
};

const updateMode=next=>{
  mode=next;
  const config=formModes[mode];
  buttons.forEach((button,index)=>{
    const buttonMode=index===0?'repair':'quote';
    const selected=buttonMode===mode;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-selected',String(selected));
  });
  formTitle.textContent=config.title;
  formCopy.textContent=config.copy;
  setLabelText(serviceLabel,config.serviceLabel);
  serviceSelect.innerHTML=`<option value="" disabled selected>${config.servicePlaceholder}</option>`+config.services.map(item=>`<option>${item}</option>`).join('');
  setLabelText(remarksLabel,config.remarksLabel);
  remarksField.placeholder=config.remarksPlaceholder;
  setSubmitText(config.submit);
};

buttons.forEach((button,index)=>button.addEventListener('click',()=>updateMode(index===0?'repair':'quote')));
updateMode('repair');

form?.addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(form);
  const text=[mode==='repair'?'Repair booking':'Phone quotation',`Name: ${data.get('name')}`,`WhatsApp: ${data.get('phone')}`,`Brand: ${data.get('brand')}`,`Model: ${data.get('model')}`,`${mode==='repair'?'Service':'Quotation type'}: ${data.get('service')}`,`${mode==='repair'?'Complaint / remarks':'Colour, storage & requirements'}: ${data.get('remarks')}`].join('\n');
  window.open('https://wa.me/971559956683?text='+encodeURIComponent(text),'_blank','noopener');
});

document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('nav')?.scrollIntoView({behavior:'smooth'}));

fetch('https://api.counterapi.dev/v1/live-world-electronics/github-official/up')
  .then(response=>response.json())
  .then(data=>{
    const counter=document.querySelector('.site-view-count > span');
    const count=Number(data.count);
    if(counter&&Number.isFinite(count))counter.textContent=count.toLocaleString();
  })
  .catch(()=>{});

const footerPaymentLogos=document.querySelector('#footer-payment-logos');
if(footerPaymentLogos){
  const sourceLogos=[...document.querySelectorAll('.payment-brand-rail img'),...document.querySelectorAll('.bnpl-logo img')];
  footerPaymentLogos.textContent='';

  const contactless=document.createElement('span');
  contactless.className='footer-pay-logo footer-contactless';
  contactless.setAttribute('role','img');
  contactless.setAttribute('aria-label','Contactless NFC payments');
  contactless.innerHTML='<svg viewBox="0 0 32 24" aria-hidden="true"><path d="M7 18c3.3-3.3 3.3-8.7 0-12M12 20.5c4.7-4.7 4.7-12.3 0-17M17 23c6.1-6.1 6.1-15.9 0-22"/><circle cx="3.5" cy="12" r="1.8"/></svg>';
  footerPaymentLogos.append(contactless);

  sourceLogos.forEach(source=>{
    const holder=document.createElement('span');
    holder.className='footer-pay-logo';
    const logo=source.cloneNode();
    logo.removeAttribute('width');
    logo.removeAttribute('height');
    logo.loading='eager';
    holder.append(logo);
    footerPaymentLogos.append(holder);
  });
}
