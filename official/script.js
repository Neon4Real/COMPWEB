const form=document.querySelector('#quote-form');
const buttons=document.querySelectorAll('.form-switch button');
let mode='repair';
const updateMode=next=>{
  mode=next;
  buttons.forEach(button=>button.classList.toggle('active',button.dataset.mode===mode));
  document.querySelector('[data-form-title]').textContent=mode==='repair'?'Book a repair':'Request a product quote';
  document.querySelector('[data-form-copy]').textContent=mode==='repair'?'Share your device and issue. We will reply on WhatsApp.':'Tell us the model, colour, storage or accessory you need.';
};
buttons.forEach(button=>button.addEventListener('click',()=>updateMode(button.dataset.mode)));
form?.addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(form);
  const text=[mode==='repair'?'Repair booking':'Product quote',`Name: ${data.get('name')}`,`WhatsApp: ${data.get('phone')}`,`Device type: ${data.get('type')}`,`Brand & model: ${data.get('model')}`,`Details: ${data.get('notes')}`].join('\n');
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
