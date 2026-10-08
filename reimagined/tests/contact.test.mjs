import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTACT_ENDPOINT, submitContact } from '../src/lib/contact.js';

test('submits to the configured email with exact message content and spam trap', async () => {
  const fields={name:'A & B',email:'hello+test@example.com',message:'Hello!\nA question & a thought.',_honey:''};
  const result=await submitContact(fields,{fetcher:async(url,options)=>{
    assert.equal(url,CONTACT_ENDPOINT);
    assert.equal(decodeURIComponent(url),'https://formsubmit.co/ajax/nabeelthotti02@gmail.com');
    assert.equal(options.method,'POST');
    const body=JSON.parse(options.body);
    for(const [k,v] of Object.entries(fields)) assert.equal(body[k],v);
    assert.equal(body._template,'table');
    assert.equal(body._captcha,undefined);
    return {ok:true,json:async()=>({success:'true',message:'Form successfully submitted'})};
  }});
  assert.equal(result.sent,true);
});
test('an activation response does not claim the message was sent', async () => {
  const result=await submitContact({}, {fetcher:async()=>({ok:true,json:async()=>({success:'true',message:'Please activate your form. Check your email.'})})});
  assert.equal(result.sent,false);
  assert.equal(result.activationRequired,true);
});
test('HTTP, network, malformed and provider failures do not claim success', async () => {
  for(const fetcher of [async()=>({ok:false}),async()=>{throw new Error('offline')},async()=>({ok:true,json:async()=>{throw new Error('not JSON')}}),async()=>({ok:true,json:async()=>({success:'false'})})]) {
    await assert.rejects(submitContact({}, {fetcher}));
  }
});
