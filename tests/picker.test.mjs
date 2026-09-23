import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../picker.js',import.meta.url),'utf8');
const redirect='https://abcdefghijklmnopabcdefghijklmnop.chromiumapp.org/picker';
const base={token:'TOKEN_01234567890123456789',state:'a'.repeat(64),redirect};

function pickerSession(parameters){
  const status={textContent:''},observed={};
  const location={origin:'https://wobbledink-g-docs.2iqlabs.com',pathname:'/picker',hash:`#${new URLSearchParams(parameters)}`,replace:url=>{observed.callback=url;}};
  class DocsView{
    constructor(viewId){observed.viewId=viewId;}
    setMode(mode){observed.mode=mode;return this;}
    setFileIds(ids){observed.fileIds=ids;return this;}
  }
  class PickerBuilder{
    addView(view){observed.view=view;return this;}
    enableFeature(){return this;}
    setAppId(){return this;}
    setDeveloperKey(){return this;}
    setOAuthToken(){return this;}
    setOrigin(){return this;}
    setCallback(callback){observed.pick=callback;return this;}
    build(){return {setVisible:()=>{observed.visible=true;}};}
  }
  const google={picker:{DocsView,PickerBuilder,ViewId:{SPREADSHEETS:'sheets'},DocsViewMode:{LIST:'list'},Feature:{NAV_HIDDEN:'hidden'},Response:{ACTION:'action',DOCUMENTS:'documents'},Action:{CANCEL:'cancel',PICKED:'picked'},Document:{ID:'id'}}};
  const document={getElementById:()=>status,createElement:()=>({}),head:{append:script=>{observed.script=script;script.onload();}}};
  const history={replaceState:(_state,_title,path)=>{observed.clearedPath=path;}};
  const context={URL,URLSearchParams,location,history,document,google,gapi:{load:(_name,options)=>options.callback()},WOBBLEDINK_PICKER_CONFIG:{appId:'1021672448758',developerKey:'AIza012345678901234567890'}};
  vm.runInNewContext(source,context);
  return {observed,status};
}

test('a pasted sheet link focuses Picker on that file and rejects another selection',()=>{
  const {observed}=pickerSession({...base,sheet_id:'sheet-1'});
  assert.equal(observed.clearedPath,'/picker');
  assert.equal(observed.fileIds,'sheet-1');
  assert.equal(observed.visible,true);
  observed.pick({action:'picked',documents:[{id:'other'}]});
  assert.equal(new URL(observed.callback).searchParams.get('error'),'invalid-selection');
});

test('a valid Picker selection returns only the selected file ID',()=>{
  const {observed}=pickerSession({...base,sheet_id:'sheet-1'});
  observed.pick({action:'picked',documents:[{id:'sheet-1'}]});
  const callback=new URL(observed.callback);
  assert.equal(callback.origin+callback.pathname,redirect);
  assert.equal(callback.searchParams.get('sheet_id'),'sheet-1');
  assert.equal(callback.searchParams.get('token'),null);
});

test('an invalid file hint stops before loading Picker',()=>{
  const {observed,status}=pickerSession({...base,sheet_id:'invalid/id'});
  assert.equal(observed.script,undefined);
  assert.match(status.textContent,/invalid Picker request/u);
});
