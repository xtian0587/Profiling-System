function setup(){
  const props=PropertiesService.getScriptProperties();
  if(!props.getProperty('SHEET_ID')){
    const ss=SpreadsheetApp.create('TNCe Pickup Orders');
    const sh=ss.getSheets()[0];
    sh.setName('Orders');
    sh.appendRow(['Order','Customer','Item','Qty','Notes','Token','Status','Created','Picked Up']);
    props.setProperty('SHEET_ID',ss.getId());
  }
  return PropertiesService.getScriptProperties().getProperty('SHEET_ID');
}
function sheet_(){const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID'); if(!id) setup(); return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Orders');}
function doGet(){return HtmlService.createHtmlOutputFromFile('index').setTitle('TNCe Pickup').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);}
function createOrder(o){
  const sh=sheet_(), data=sh.getDataRange().getValues(), num=o.order||('ORD-'+String(Math.max(0,data.length)).padStart(4,'0'));
  const token=Utilities.getUuid().replace(/-/g,'');
  sh.appendRow([num,o.customer,o.item,Number(o.qty||1),o.notes||'',token,'READY',new Date(),'']);
  const url=ScriptApp.getService().getUrl()+'?t='+encodeURIComponent(token);
  return {order:num,customer:o.customer,item:o.item,qty:Number(o.qty||1),url};
}
function findRow_(token){
  const sh=sheet_(), vals=sh.getDataRange().getValues();
  for(let i=1;i<vals.length;i++) if(String(vals[i][5])===String(token)) return {sh,row:i+1,vals:vals[i]};
  return null;
}
function getOrder(token){
  const x=findRow_(token); if(!x)return null; const v=x.vals;
  return {order:v[0],customer:v[1],item:v[2],qty:v[3],notes:v[4],status:v[6],created:v[7],picked:v[8]};
}
function confirmPickup(token){
  const x=findRow_(token); if(!x)throw new Error('Order not found.');
  if(String(x.vals[6])==='PICKED UP') return {time:x.vals[8]};
  const now=new Date(); x.sh.getRange(x.row,7).setValue('PICKED UP'); x.sh.getRange(x.row,9).setValue(now);
  return {time:Utilities.formatDate(now,Session.getScriptTimeZone(),'MMM d, yyyy h:mm a')};
}
function listOrders(){
  const vals=sheet_().getDataRange().getValues();
  return vals.slice(1).reverse().map(v=>({order:v[0],customer:v[1],item:v[2],qty:v[3],status:v[6],created:v[7]}));
}