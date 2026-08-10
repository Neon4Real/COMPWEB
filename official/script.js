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
    const counter=document.querySelector('#view-count');
    if(counter&&data.count)counter.textContent=data.count.toLocaleString();
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
