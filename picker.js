(() => {
  'use strict';
  const status=document.getElementById('status');
  const fail=message=>{status.textContent=message;};
  const raw=new URLSearchParams(location.hash.slice(1));
  const value=name=>raw.getAll(name).length===1?raw.get(name):'';
  const token=value('token'),state=value('state'),redirectRaw=value('redirect'),sheetId=value('sheet_id');
  history.replaceState(null,'',location.pathname);
  let redirect;
  try{redirect=new URL(redirectRaw);}catch{}
  const validRedirect=redirect&&redirect.protocol==='https:'&&!redirect.port&&!redirect.username&&!redirect.password&&/^[a-p]{32}\.chromiumapp\.org$/u.test(redirect.hostname)&&redirect.pathname==='/picker'&&!redirect.search&&!redirect.hash;
  if(!validRedirect||!/^[a-f0-9]{64}$/u.test(state)||token.length<20||token.length>4096||/\s/u.test(token)||(raw.has('sheet_id')&&!/^[\w-]+$/u.test(sheetId))){fail('The extension sent an invalid Picker request. Close this window and try again.');return;}
  const config=globalThis.WOBBLEDINK_PICKER_CONFIG;
  if(!config||!/^[0-9]+$/u.test(config.appId)||!/^AIza[\w-]{20,}$/u.test(config.developerKey)){fail('Google Picker is not configured on this host.');return;}
  let finished=false;
  const finish=params=>{if(finished)return;finished=true;const callback=new URL(redirect.href);callback.search=new URLSearchParams({state,...params}).toString();location.replace(callback.href);};
  const pickerCallback=data=>{
    const action=data?.[google.picker.Response.ACTION];
    if(action===google.picker.Action.CANCEL){finish({error:'cancelled'});return;}
    if(action!==google.picker.Action.PICKED)return;
    const documents=data?.[google.picker.Response.DOCUMENTS];
    const id=Array.isArray(documents)&&documents.length===1?documents[0]?.[google.picker.Document.ID]:'';
    if(!/^[\w-]+$/u.test(id||'')){finish({error:'invalid-selection'});return;}
    if(sheetId&&id!==sheetId){finish({error:'invalid-selection'});return;}
    finish({sheet_id:id});
  };
  const showPicker=()=>{
    try{
      const view=new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS).setMode(google.picker.DocsViewMode.LIST);
      if(sheetId)view.setFileIds(sheetId);
      const picker=new google.picker.PickerBuilder().addView(view).enableFeature(google.picker.Feature.NAV_HIDDEN).setAppId(config.appId).setDeveloperKey(config.developerKey).setOAuthToken(token).setOrigin(location.origin).setCallback(pickerCallback).build();
      picker.setVisible(true);status.textContent='Choose one spreadsheet in Google Picker.';
    }catch{finish({error:'picker-failed'});}
  };
  const script=document.createElement('script');
  script.src='https://apis.google.com/js/api.js';script.referrerPolicy='no-referrer';
  script.onload=()=>{if(!globalThis.gapi?.load){finish({error:'picker-load-failed'});return;}globalThis.gapi.load('picker',{callback:showPicker,onerror:()=>finish({error:'picker-load-failed'}),timeout:15000,ontimeout:()=>finish({error:'picker-timeout'})});};
  script.onerror=()=>finish({error:'picker-load-failed'});document.head.append(script);
})();
