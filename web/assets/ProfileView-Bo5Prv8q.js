import{H as pt,I as ue,J as ht,K as mt,L as ft,M as gt,N as _t,O as Ee,S as vt,P as bt,Q as wt,_ as yt,u as xt,R as Rt,r as C,p as Oe,j as u,e as x,h as kt,o as ae,d as i,a as B,D as _,i as v,t as g,c as Ne,F as Ie,x as Ce,T as re,U as At,V as Tt,W as Pt,X as Ut}from"./index-B0bI5t4i.js";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $e="firebasestorage.googleapis.com",He="storageBucket",Et=2*60*1e3,Ot=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y extends wt{constructor(t,n,s=0){super(ge(t),`Firebase Storage: ${n} (${ge(t)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,y.prototype)}get status(){return this.status_}set status(t){this.status_=t}_codeEquals(t){return ge(t)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(t){this.customData.serverResponse=t,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var w;(function(e){e.UNKNOWN="unknown",e.OBJECT_NOT_FOUND="object-not-found",e.BUCKET_NOT_FOUND="bucket-not-found",e.PROJECT_NOT_FOUND="project-not-found",e.QUOTA_EXCEEDED="quota-exceeded",e.UNAUTHENTICATED="unauthenticated",e.UNAUTHORIZED="unauthorized",e.UNAUTHORIZED_APP="unauthorized-app",e.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",e.INVALID_CHECKSUM="invalid-checksum",e.CANCELED="canceled",e.INVALID_EVENT_NAME="invalid-event-name",e.INVALID_URL="invalid-url",e.INVALID_DEFAULT_BUCKET="invalid-default-bucket",e.NO_DEFAULT_BUCKET="no-default-bucket",e.CANNOT_SLICE_BLOB="cannot-slice-blob",e.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",e.NO_DOWNLOAD_URL="no-download-url",e.INVALID_ARGUMENT="invalid-argument",e.INVALID_ARGUMENT_COUNT="invalid-argument-count",e.APP_DELETED="app-deleted",e.INVALID_ROOT_OPERATION="invalid-root-operation",e.INVALID_FORMAT="invalid-format",e.INTERNAL_ERROR="internal-error",e.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(w||(w={}));function ge(e){return"storage/"+e}function be(){const e="An unknown error occurred, please check the error payload for server response.";return new y(w.UNKNOWN,e)}function Nt(e){return new y(w.OBJECT_NOT_FOUND,"Object '"+e+"' does not exist.")}function It(e){return new y(w.QUOTA_EXCEEDED,"Quota for bucket '"+e+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function Ct(){const e="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new y(w.UNAUTHENTICATED,e)}function Vt(){return new y(w.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function Dt(e){return new y(w.UNAUTHORIZED,"User does not have permission to access '"+e+"'.")}function Lt(){return new y(w.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function St(){return new y(w.CANCELED,"User canceled the upload/download.")}function Bt(e){return new y(w.INVALID_URL,"Invalid URL '"+e+"'.")}function $t(e){return new y(w.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+e+"'.")}function Ht(){return new y(w.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+He+"' property when initializing the app?")}function Mt(){return new y(w.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function Ft(){return new y(w.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function jt(e){return new y(w.UNSUPPORTED_ENVIRONMENT,`${e} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function ve(e){return new y(w.INVALID_ARGUMENT,e)}function Me(){return new y(w.APP_DELETED,"The Firebase app was deleted.")}function Gt(e){return new y(w.INVALID_ROOT_OPERATION,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function te(e,t){return new y(w.INVALID_FORMAT,"String does not match format '"+e+"': "+t)}function ee(e){throw new y(w.INTERNAL_ERROR,"Internal error: "+e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V{constructor(t,n){this.bucket=t,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const t=encodeURIComponent;return"/b/"+t(this.bucket)+"/o/"+t(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(t,n){let s;try{s=V.makeFromUrl(t,n)}catch{return new V(t,"")}if(s.path==="")return s;throw $t(t)}static makeFromUrl(t,n){let s=null;const o="([A-Za-z0-9.\\-_]+)";function a(R){R.path.charAt(R.path.length-1)==="/"&&(R.path_=R.path_.slice(0,-1))}const l="(/(.*))?$",p=new RegExp("^gs://"+o+l,"i"),h={bucket:1,path:3};function m(R){R.path_=decodeURIComponent(R.path)}const f="v[A-Za-z0-9_]+",P=n.replace(/[.]/g,"\\."),A="(/([^?#]*).*)?$",U=new RegExp(`^https?://${P}/${f}/b/${o}/o${A}`,"i"),E={bucket:1,path:3},L=n===$e?"(?:storage.googleapis.com|storage.cloud.google.com)":n,b="([^?#]*)",D=new RegExp(`^https?://${L}/${o}/${b}`,"i"),k=[{regex:p,indices:h,postModify:a},{regex:U,indices:E,postModify:m},{regex:D,indices:{bucket:1,path:2},postModify:m}];for(let R=0;R<k.length;R++){const H=k[R],F=H.regex.exec(t);if(F){const X=F[H.indices.bucket];let W=F[H.indices.path];W||(W=""),s=new V(X,W),H.postModify(s);break}}if(s==null)throw Bt(t);return s}}class zt{constructor(t){this.promise_=Promise.reject(t)}getPromise(){return this.promise_}cancel(t=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wt(e,t,n){let s=1,o=null,a=null,l=!1,p=0;function h(){return p===2}let m=!1;function f(...b){m||(m=!0,t.apply(null,b))}function P(b){o=setTimeout(()=>{o=null,e(U,h())},b)}function A(){a&&clearTimeout(a)}function U(b,...D){if(m){A();return}if(b){A(),f.call(null,b,...D);return}if(h()||l){A(),f.call(null,b,...D);return}s<64&&(s*=2);let k;p===1?(p=2,k=0):k=(s+Math.random())*1e3,P(k)}let E=!1;function L(b){E||(E=!0,A(),!m&&(o!==null?(b||(p=2),clearTimeout(o),P(0)):b||(p=1)))}return P(0),a=setTimeout(()=>{l=!0,L(!0)},n),L}function qt(e){e(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kt(e){return e!==void 0}function Jt(e){return typeof e=="object"&&!Array.isArray(e)}function we(e){return typeof e=="string"||e instanceof String}function Ve(e){return ye()&&e instanceof Blob}function ye(){return typeof Blob<"u"}function De(e,t,n,s){if(s<t)throw ve(`Invalid value for '${e}'. Expected ${t} or greater.`);if(s>n)throw ve(`Invalid value for '${e}'. Expected ${n} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xe(e,t,n){let s=t;return n==null&&(s=`https://${t}`),`${n}://${s}/v0${e}`}function Fe(e){const t=encodeURIComponent;let n="?";for(const s in e)if(e.hasOwnProperty(s)){const o=t(s)+"="+t(e[s]);n=n+o+"&"}return n=n.slice(0,-1),n}var K;(function(e){e[e.NO_ERROR=0]="NO_ERROR",e[e.NETWORK_ERROR=1]="NETWORK_ERROR",e[e.ABORT=2]="ABORT"})(K||(K={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xt(e,t){const n=e>=500&&e<600,o=[408,429].indexOf(e)!==-1,a=t.indexOf(e)!==-1;return n||o||a}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt{constructor(t,n,s,o,a,l,p,h,m,f,P,A=!0){this.url_=t,this.method_=n,this.headers_=s,this.body_=o,this.successCodes_=a,this.additionalRetryCodes_=l,this.callback_=p,this.errorCallback_=h,this.timeout_=m,this.progressCallback_=f,this.connectionFactory_=P,this.retry=A,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((U,E)=>{this.resolve_=U,this.reject_=E,this.start_()})}start_(){const t=(s,o)=>{if(o){s(!1,new le(!1,null,!0));return}const a=this.connectionFactory_();this.pendingConnection_=a;const l=p=>{const h=p.loaded,m=p.lengthComputable?p.total:-1;this.progressCallback_!==null&&this.progressCallback_(h,m)};this.progressCallback_!==null&&a.addUploadProgressListener(l),a.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&a.removeUploadProgressListener(l),this.pendingConnection_=null;const p=a.getErrorCode()===K.NO_ERROR,h=a.getStatus();if(!p||Xt(h,this.additionalRetryCodes_)&&this.retry){const f=a.getErrorCode()===K.ABORT;s(!1,new le(!1,null,f));return}const m=this.successCodes_.indexOf(h)!==-1;s(!0,new le(m,a))})},n=(s,o)=>{const a=this.resolve_,l=this.reject_,p=o.connection;if(o.wasSuccessCode)try{const h=this.callback_(p,p.getResponse());Kt(h)?a(h):a()}catch(h){l(h)}else if(p!==null){const h=be();h.serverResponse=p.getErrorText(),this.errorCallback_?l(this.errorCallback_(p,h)):l(h)}else if(o.canceled){const h=this.appDelete_?Me():St();l(h)}else{const h=Lt();l(h)}};this.canceled_?n(!1,new le(!1,null,!0)):this.backoffId_=Wt(t,n,this.timeout_)}getPromise(){return this.promise_}cancel(t){this.canceled_=!0,this.appDelete_=t||!1,this.backoffId_!==null&&qt(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class le{constructor(t,n,s){this.wasSuccessCode=t,this.connection=n,this.canceled=!!s}}function Zt(e,t){t!==null&&t.length>0&&(e.Authorization="Firebase "+t)}function Yt(e,t){e["X-Firebase-Storage-Version"]="webjs/"+(t??"AppManager")}function en(e,t){t&&(e["X-Firebase-GMPID"]=t)}function tn(e,t){t!==null&&(e["X-Firebase-AppCheck"]=t)}function nn(e,t,n,s,o,a,l=!0){const p=Fe(e.urlParams),h=e.url+p,m=Object.assign({},e.headers);return en(m,t),Zt(m,n),Yt(m,a),tn(m,s),new Qt(h,e.method,m,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,o,l)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sn(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function on(...e){const t=sn();if(t!==void 0){const n=new t;for(let s=0;s<e.length;s++)n.append(e[s]);return n.getBlob()}else{if(ye())return new Blob(e);throw new y(w.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function an(e,t,n){return e.webkitSlice?e.webkitSlice(t,n):e.mozSlice?e.mozSlice(t,n):e.slice?e.slice(t,n):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rn(e){if(typeof atob>"u")throw jt("base-64");return atob(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class _e{constructor(t,n){this.data=t,this.contentType=n||null}}function ln(e,t){switch(e){case $.RAW:return new _e(je(t));case $.BASE64:case $.BASE64URL:return new _e(Ge(e,t));case $.DATA_URL:return new _e(un(t),dn(t))}throw be()}function je(e){const t=[];for(let n=0;n<e.length;n++){let s=e.charCodeAt(n);if(s<=127)t.push(s);else if(s<=2047)t.push(192|s>>6,128|s&63);else if((s&64512)===55296)if(!(n<e.length-1&&(e.charCodeAt(n+1)&64512)===56320))t.push(239,191,189);else{const a=s,l=e.charCodeAt(++n);s=65536|(a&1023)<<10|l&1023,t.push(240|s>>18,128|s>>12&63,128|s>>6&63,128|s&63)}else(s&64512)===56320?t.push(239,191,189):t.push(224|s>>12,128|s>>6&63,128|s&63)}return new Uint8Array(t)}function cn(e){let t;try{t=decodeURIComponent(e)}catch{throw te($.DATA_URL,"Malformed data URL.")}return je(t)}function Ge(e,t){switch(e){case $.BASE64:{const o=t.indexOf("-")!==-1,a=t.indexOf("_")!==-1;if(o||a)throw te(e,"Invalid character '"+(o?"-":"_")+"' found: is it base64url encoded?");break}case $.BASE64URL:{const o=t.indexOf("+")!==-1,a=t.indexOf("/")!==-1;if(o||a)throw te(e,"Invalid character '"+(o?"+":"/")+"' found: is it base64 encoded?");t=t.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=rn(t)}catch(o){throw o.message.includes("polyfill")?o:te(e,"Invalid character found")}const s=new Uint8Array(n.length);for(let o=0;o<n.length;o++)s[o]=n.charCodeAt(o);return s}class ze{constructor(t){this.base64=!1,this.contentType=null;const n=t.match(/^data:([^,]+)?,/);if(n===null)throw te($.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const s=n[1]||null;s!=null&&(this.base64=pn(s,";base64"),this.contentType=this.base64?s.substring(0,s.length-7):s),this.rest=t.substring(t.indexOf(",")+1)}}function un(e){const t=new ze(e);return t.base64?Ge($.BASE64,t.rest):cn(t.rest)}function dn(e){return new ze(e).contentType}function pn(e,t){return e.length>=t.length?e.substring(e.length-t.length)===t:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z{constructor(t,n){let s=0,o="";Ve(t)?(this.data_=t,s=t.size,o=t.type):t instanceof ArrayBuffer?(n?this.data_=new Uint8Array(t):(this.data_=new Uint8Array(t.byteLength),this.data_.set(new Uint8Array(t))),s=this.data_.length):t instanceof Uint8Array&&(n?this.data_=t:(this.data_=new Uint8Array(t.length),this.data_.set(t)),s=t.length),this.size_=s,this.type_=o}size(){return this.size_}type(){return this.type_}slice(t,n){if(Ve(this.data_)){const s=this.data_,o=an(s,t,n);return o===null?null:new z(o)}else{const s=new Uint8Array(this.data_.buffer,t,n-t);return new z(s,!0)}}static getBlob(...t){if(ye()){const n=t.map(s=>s instanceof z?s.data_:s);return new z(on.apply(null,n))}else{const n=t.map(l=>we(l)?ln($.RAW,l).data:l.data_);let s=0;n.forEach(l=>{s+=l.byteLength});const o=new Uint8Array(s);let a=0;return n.forEach(l=>{for(let p=0;p<l.length;p++)o[a++]=l[p]}),new z(o,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function We(e){let t;try{t=JSON.parse(e)}catch{return null}return Jt(t)?t:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hn(e){if(e.length===0)return null;const t=e.lastIndexOf("/");return t===-1?"":e.slice(0,t)}function mn(e,t){const n=t.split("/").filter(s=>s.length>0).join("/");return e.length===0?n:e+"/"+n}function qe(e){const t=e.lastIndexOf("/",e.length-2);return t===-1?e:e.slice(t+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fn(e,t){return t}class T{constructor(t,n,s,o){this.server=t,this.local=n||t,this.writable=!!s,this.xform=o||fn}}let ce=null;function gn(e){return!we(e)||e.length<2?e:qe(e)}function Ke(){if(ce)return ce;const e=[];e.push(new T("bucket")),e.push(new T("generation")),e.push(new T("metageneration")),e.push(new T("name","fullPath",!0));function t(a,l){return gn(l)}const n=new T("name");n.xform=t,e.push(n);function s(a,l){return l!==void 0?Number(l):l}const o=new T("size");return o.xform=s,e.push(o),e.push(new T("timeCreated")),e.push(new T("updated")),e.push(new T("md5Hash",null,!0)),e.push(new T("cacheControl",null,!0)),e.push(new T("contentDisposition",null,!0)),e.push(new T("contentEncoding",null,!0)),e.push(new T("contentLanguage",null,!0)),e.push(new T("contentType",null,!0)),e.push(new T("metadata","customMetadata",!0)),ce=e,ce}function _n(e,t){function n(){const s=e.bucket,o=e.fullPath,a=new V(s,o);return t._makeStorageReference(a)}Object.defineProperty(e,"ref",{get:n})}function vn(e,t,n){const s={};s.type="file";const o=n.length;for(let a=0;a<o;a++){const l=n[a];s[l.local]=l.xform(s,t[l.server])}return _n(s,e),s}function Je(e,t,n){const s=We(t);return s===null?null:vn(e,s,n)}function bn(e,t,n,s){const o=We(t);if(o===null||!we(o.downloadTokens))return null;const a=o.downloadTokens;if(a.length===0)return null;const l=encodeURIComponent;return a.split(",").map(m=>{const f=e.bucket,P=e.fullPath,A="/b/"+l(f)+"/o/"+l(P),U=xe(A,n,s),E=Fe({alt:"media",token:m});return U+E})[0]}function wn(e,t){const n={},s=t.length;for(let o=0;o<s;o++){const a=t[o];a.writable&&(n[a.server]=e[a.local])}return JSON.stringify(n)}class Xe{constructor(t,n,s,o){this.url=t,this.method=n,this.handler=s,this.timeout=o,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qe(e){if(!e)throw be()}function yn(e,t){function n(s,o){const a=Je(e,o,t);return Qe(a!==null),a}return n}function xn(e,t){function n(s,o){const a=Je(e,o,t);return Qe(a!==null),bn(a,o,e.host,e._protocol)}return n}function Ze(e){function t(n,s){let o;return n.getStatus()===401?n.getErrorText().includes("Firebase App Check token is invalid")?o=Vt():o=Ct():n.getStatus()===402?o=It(e.bucket):n.getStatus()===403?o=Dt(e.path):o=s,o.status=n.getStatus(),o.serverResponse=s.serverResponse,o}return t}function Rn(e){const t=Ze(e);function n(s,o){let a=t(s,o);return s.getStatus()===404&&(a=Nt(e.path)),a.serverResponse=o.serverResponse,a}return n}function kn(e,t,n){const s=t.fullServerUrl(),o=xe(s,e.host,e._protocol),a="GET",l=e.maxOperationRetryTime,p=new Xe(o,a,xn(e,n),l);return p.errorHandler=Rn(t),p}function An(e,t){return e&&e.contentType||t&&t.type()||"application/octet-stream"}function Tn(e,t,n){const s=Object.assign({},n);return s.fullPath=e.path,s.size=t.size(),s.contentType||(s.contentType=An(null,t)),s}function Pn(e,t,n,s,o){const a=t.bucketOnlyServerUrl(),l={"X-Goog-Upload-Protocol":"multipart"};function p(){let k="";for(let R=0;R<2;R++)k=k+Math.random().toString().slice(2);return k}const h=p();l["Content-Type"]="multipart/related; boundary="+h;const m=Tn(t,s,o),f=wn(m,n),P="--"+h+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+f+`\r
--`+h+`\r
Content-Type: `+m.contentType+`\r
\r
`,A=`\r
--`+h+"--",U=z.getBlob(P,s,A);if(U===null)throw Mt();const E={name:m.fullPath},L=xe(a,e.host,e._protocol),b="POST",D=e.maxUploadRetryTime,O=new Xe(L,b,yn(e,n),D);return O.urlParams=E,O.headers=l,O.body=U.uploadData(),O.errorHandler=Ze(t),O}class Un{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=K.NO_ERROR,this.sendPromise_=new Promise(t=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=K.ABORT,t()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=K.NETWORK_ERROR,t()}),this.xhr_.addEventListener("load",()=>{t()})})}send(t,n,s,o){if(this.sent_)throw ee("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(n,t,!0),o!==void 0)for(const a in o)o.hasOwnProperty(a)&&this.xhr_.setRequestHeader(a,o[a].toString());return s!==void 0?this.xhr_.send(s):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw ee("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw ee("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw ee("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw ee("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(t){return this.xhr_.getResponseHeader(t)}addUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",t)}removeUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",t)}}class En extends Un{initXhr(){this.xhr_.responseType="text"}}function Ye(){return new En}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J{constructor(t,n){this._service=t,n instanceof V?this._location=n:this._location=V.makeFromUrl(n,t.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(t,n){return new J(t,n)}get root(){const t=new V(this._location.bucket,"");return this._newRef(this._service,t)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return qe(this._location.path)}get storage(){return this._service}get parent(){const t=hn(this._location.path);if(t===null)return null;const n=new V(this._location.bucket,t);return new J(this._service,n)}_throwIfRoot(t){if(this._location.path==="")throw Gt(t)}}function On(e,t,n){e._throwIfRoot("uploadBytes");const s=Pn(e.storage,e._location,Ke(),new z(t,!0),n);return e.storage.makeRequestWithTokens(s,Ye).then(o=>({metadata:o,ref:e}))}function Nn(e){e._throwIfRoot("getDownloadURL");const t=kn(e.storage,e._location,Ke());return e.storage.makeRequestWithTokens(t,Ye).then(n=>{if(n===null)throw Ft();return n})}function In(e,t){const n=mn(e._location.path,t),s=new V(e._location.bucket,n);return new J(e.storage,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cn(e){return/^[A-Za-z]+:\/\//.test(e)}function Vn(e,t){return new J(e,t)}function et(e,t){if(e instanceof Re){const n=e;if(n._bucket==null)throw Ht();const s=new J(n,n._bucket);return t!=null?et(s,t):s}else return t!==void 0?In(e,t):e}function Dn(e,t){if(t&&Cn(t)){if(e instanceof Re)return Vn(e,t);throw ve("To use ref(service, url), the first argument must be a Storage instance.")}else return et(e,t)}function Le(e,t){const n=t==null?void 0:t[He];return n==null?null:V.makeFromBucketSpec(n,e)}function Ln(e,t,n,s={}){e.host=`${t}:${n}`,e._protocol="http";const{mockUserToken:o}=s;o&&(e._overrideAuthToken=typeof o=="string"?o:ft(o,e.app.options.projectId))}class Re{constructor(t,n,s,o,a){this.app=t,this._authProvider=n,this._appCheckProvider=s,this._url=o,this._firebaseVersion=a,this._bucket=null,this._host=$e,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Et,this._maxUploadRetryTime=Ot,this._requests=new Set,o!=null?this._bucket=V.makeFromBucketSpec(o,this._host):this._bucket=Le(this._host,this.app.options)}get host(){return this._host}set host(t){this._host=t,this._url!=null?this._bucket=V.makeFromBucketSpec(this._url,t):this._bucket=Le(t,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(t){De("time",0,Number.POSITIVE_INFINITY,t),this._maxUploadRetryTime=t}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(t){De("time",0,Number.POSITIVE_INFINITY,t),this._maxOperationRetryTime=t}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const t=this._authProvider.getImmediate({optional:!0});if(t){const n=await t.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){if(bt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=this._appCheckProvider.getImmediate({optional:!0});return t?(await t.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(t=>t.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(t){return new J(this,t)}_makeRequest(t,n,s,o,a=!0){if(this._deleted)return new zt(Me());{const l=nn(t,this._appId,s,o,n,this._firebaseVersion,a);return this._requests.add(l),l.getPromise().then(()=>this._requests.delete(l),()=>this._requests.delete(l)),l}}async makeRequestWithTokens(t,n){const[s,o]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(t,n,s,o).getPromise()}}const Se="@firebase/storage",Be="0.13.7";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt="storage";function Sn(e,t,n){return e=ue(e),On(e,t,n)}function Bn(e){return e=ue(e),Nn(e)}function $n(e,t){return e=ue(e),Dn(e,t)}function Hn(e=pt(),t){e=ue(e);const s=ht(e,tt).getImmediate({identifier:t}),o=mt("storage");return o&&Mn(s,...o),s}function Mn(e,t,n,s={}){Ln(e,t,n,s)}function Fn(e,{instanceIdentifier:t}){const n=e.getProvider("app").getImmediate(),s=e.getProvider("auth-internal"),o=e.getProvider("app-check-internal");return new Re(n,s,o,t,vt)}function jn(){gt(new _t(tt,Fn,"PUBLIC").setMultipleInstances(!0)),Ee(Se,Be,""),Ee(Se,Be,"esm2017")}jn();const Gn={style:{position:"relative",display:"inline-block"}},zn={class:"mt-4"},Wn={class:"text-center"},qn=300,Kn={__name:"ProfileView",setup(e){const t=xt(),n=kt(),s=Hn(),{name:o,email:a,nickname:l,profile_photo:p,descripcion:h,telefono:m,direccion:f,saldo:P,ventas:A,compras:U,type:E}=Rt(t),L=C("personal"),b=C({show:!1,text:"",color:"success"}),D=C(!1),O=C(""),k=C(""),R=C(""),H=C(!1),F=C(!1),X=C(!1),W=C(!1),de=C(!1);function S(d,r="success"){b.value.text=d,b.value.color=r,b.value.show=!0}function nt(){return W.value=!1,de.value=m.value&&!/^\d{9}$/.test(m.value),!(W.value||de.value)}async function ne(){if(!nt()){S("Por favor, corrige los campos marcados.","error");return}try{await t.editUserInDatabase(),t.setCredentials({id:t.id,email:t.email,name:o.value,nickname:l.value,profile_photo:p.value,descripcion:h.value,telefono:m.value,direccion:f.value,saldo:P.value,compras:U.value,ventas:A.value,alta:t.alta,type:E.value}),S("Cambios guardados correctamente")}catch(d){console.error(d),S("Error al guardar los cambios","error")}}function st(){D.value=!0}function ot(){t.logout(),n.push("/"),D.value=!1,S("Sesión cerrada")}async function it(d){const r=d.target.files[0];if(r&&t.id){const j=`profile_photos/${t.id}/${r.name}`,q=$n(s,j);try{await Sn(q,r);const N=await Bn(q);p.value=N,await ne(),S("Foto de perfil actualizada")}catch(N){console.error(N),S("Error al subir la imagen","error")}}}async function at(){if(!O.value||!k.value||!R.value)return S("Rellena todos los campos de contraseña","error");if(k.value!==R.value)return S("Las nuevas contraseñas no coinciden","error");if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(k.value))return S("La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.","error");try{const j=At().currentUser,q=Tt.credential(j.email,O.value);await Pt(j,q),await Ut(j,k.value),O.value="",k.value="",R.value="",S("Contraseña actualizada correctamente")}catch(r){console.error(r),S("Error al cambiar la contraseña: "+r.message,"error")}}const Z=C(!1),pe=C(0),ke=[{name:"Emojis",avatars:["https://api.dicebear.com/9.x/fun-emoji/svg?seed=Brian","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Vivian","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Avery","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Oliver","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Chase","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Kimberly","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Luis","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Christian","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jameson","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Katherine","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Leo","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Sadie","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Amaya","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Mason","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Wyatt","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jocelyn","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Mackenzie","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Alexander","https://api.dicebear.com/9.x/fun-emoji/svg?seed=Liliana"]},{name:"Robots",avatars:["https://api.dicebear.com/9.x/bottts/svg?seed=Destiny","https://api.dicebear.com/7.x/bottts/svg?seed=Robert","https://api.dicebear.com/7.x/bottts/svg?seed=Christopher","https://api.dicebear.com/7.x/bottts/svg?seed=Alexander","https://api.dicebear.com/7.x/bottts/svg?seed=Oliver","https://api.dicebear.com/7.x/bottts/svg?seed=Mason","https://api.dicebear.com/7.x/bottts/svg?seed=Amaya","https://api.dicebear.com/7.x/bottts/svg?seed=Sophia","https://api.dicebear.com/7.x/bottts/svg?seed=Valentina","https://api.dicebear.com/7.x/bottts/svg?seed=Wyatt","https://api.dicebear.com/7.x/bottts/svg?seed=Ryan","https://api.dicebear.com/7.x/bottts/svg?seed=Jack","https://api.dicebear.com/7.x/bottts/svg?seed=Nolan","https://api.dicebear.com/7.x/bottts/svg?seed=Liliana","https://api.dicebear.com/7.x/bottts/svg?seed=Easton","https://api.dicebear.com/7.x/bottts/svg?seed=Ryker","https://api.dicebear.com/7.x/bottts/svg?seed=Andrea","https://api.dicebear.com/7.x/bottts/svg?seed=Sadie","https://api.dicebear.com/7.x/bottts/svg?seed=Leo","https://api.dicebear.com/7.x/bottts/svg?seed=Liam"]},{name:"Fantasía",avatars:["https://images.icon-icons.com/2622/PNG/512/brand_jedi_order_icon_158843.png","https://images.icon-icons.com/1070/PNG/512/darth-vader_icon-icons.com_76959.png","https://images.icon-icons.com/1070/PNG/512/clone-trooper_icon-icons.com_76948.png","https://images.icon-icons.com/567/PNG/512/r2d2_icon-icons.com_54376.png","https://images.icon-icons.com/2622/PNG/512/medieval_knight_icon_158282.png","https://images.icon-icons.com/2622/PNG/512/medieval_spartan_icon_157502.png","https://images.icon-icons.com/4059/PNG/512/fairytale_sword_fantasy_world_weapon_icon_258474.png","https://images.icon-icons.com/3247/PNG/512/hat_wizard_icon_198538.png","https://images.icon-icons.com/1508/PNG/512/spaceinvaders_104010.png","https://images.icon-icons.com/1603/PNG/512/video-game-play-toad-mushroom-mario_108577.png","https://images.icon-icons.com/749/PNG/512/pacman_icon-icons.com_63747.png","https://images.icon-icons.com/159/PNG/256/minecraft_22400.png","https://images.icon-icons.com/851/PNG/512/Pokeball_icon-icons.com_67533.png","https://images.icon-icons.com/851/PNG/512/bulbasaur_icon-icons.com_67580.png","https://images.icon-icons.com/851/PNG/512/charmander_icon-icons.com_67576.png","https://images.icon-icons.com/851/PNG/512/squirtle_icon-icons.com_67504.png","https://images.icon-icons.com/3688/PNG/512/death_monster_scary_devil_halloween_icon_229411.png","https://images.icon-icons.com/3688/PNG/512/evil_scary_monster_frankentein_halloween_icon_229392.png","https://images.icon-icons.com/3688/PNG/512/ghost_monster_dead_horror_zombie_halloween_icon_229398.png","https://images.icon-icons.com/3158/PNG/512/creature_fantasy_monster_ogre_orc_icon_193280.png"]},{name:"Animales",avatars:["https://tse3.mm.bing.net/th/id/OIP.mG3GNQ_kbtN5tMLsCQDFTgHaH6?pid=Api","https://tse1.mm.bing.net/th?id=OIP.696iNeIW7ovi0_WDZxAadwHaGO&pid=Api","https://tse4.mm.bing.net/th?id=OIP.h3d5hPOcCaRvy7EDeK09kwHaIc&pid=Api","https://tse4.mm.bing.net/th/id/OIP.zJznsgQ5GEgBHBmJPbBbGAHaFF?pid=Api","https://tse2.mm.bing.net/th/id/OIP.bQM2Q5ECFpC4RGywKO11cgHaHn?pid=Api","https://tse2.mm.bing.net/th?id=OIP.KMzFny4XknIoNsS-n5hvFwHaHa&pid=Api","https://tse4.mm.bing.net/th?id=OIP.X3ZGiJo560n67Y209PiA6wHaHa&pid=Api","https://tse3.mm.bing.net/th/id/OIP.2dov8lU7w4fVUwhuodE6aAHaI3?pid=Api","https://tse1.mm.bing.net/th?id=OIP.gTOF9aY_Bdhz1qhoYya-jQHaFU&pid=Api","https://tse4.mm.bing.net/th?id=OIP.jonh3EwUgDK1U5WsyFNSpwHaHa&pid=Api","https://tse4.mm.bing.net/th?id=OIP.kDyE99pyvV_jJXflBkU9tgHaJs&pid=Api","https://tse2.mm.bing.net/th?id=OIP.kT8my5ZqNzHak4Sf62O2MgHaHa&pid=Api","https://tse2.mm.bing.net/th?id=OIP.WMRwpGoCXUJdJHywNJpJAwHaHa&pid=Api","https://tse1.mm.bing.net/th?id=OIP.f7pk9rYxqh1SdgB3TI_2cwHaIS&pid=Api","https://tse3.mm.bing.net/th/id/OIP.72o2sK1gO0EM--my5t-KmwHaHa?pid=Api","https://tse4.mm.bing.net/th?id=OIP.ASQ4mvJJPax6Y0WzITkVawHaHa&pid=Api","https://tse4.mm.bing.net/th?id=OIP.QCB53cTmrmBlSValdrCcXAHaHT&pid=Api","https://tse1.mm.bing.net/th/id/OIP.Wx2boM3N5GlgBe0-aLzZAwHaHa?pid=Api","https://tse3.mm.bing.net/th/id/OIP.LiUWfpnEtPmI-fyuWdmeMgHaHa?pid=Api","https://tse4.mm.bing.net/th/id/OIP.ZVQqMhDrB--19syAd6VdXwHaHa?pid=Api"]},{name:"Pixel Art",avatars:["https://api.dicebear.com/9.x/pixel-art/svg?seed=Brian","https://api.dicebear.com/9.x/pixel-art/svg?seed=Vivian","https://api.dicebear.com/9.x/pixel-art/svg?seed=Avery","https://api.dicebear.com/9.x/pixel-art/svg?seed=Oliver","https://api.dicebear.com/9.x/pixel-art/svg?seed=Chase","https://api.dicebear.com/9.x/pixel-art/svg?seed=Kimberly","https://api.dicebear.com/9.x/pixel-art/svg?seed=Luis","https://api.dicebear.com/9.x/pixel-art/svg?seed=Emery","https://api.dicebear.com/9.x/pixel-art/svg?seed=Christian","https://api.dicebear.com/9.x/pixel-art/svg?seed=Jameson","https://api.dicebear.com/9.x/pixel-art/svg?seed=Katherine","https://api.dicebear.com/9.x/pixel-art/svg?seed=Leo","https://api.dicebear.com/9.x/pixel-art/svg?seed=Sadie","https://api.dicebear.com/9.x/pixel-art/svg?seed=Amaya","https://api.dicebear.com/9.x/pixel-art/svg?seed=Mason","https://api.dicebear.com/9.x/pixel-art/svg?seed=Wyatt","https://api.dicebear.com/9.x/pixel-art/svg?seed=Jocelyn","https://api.dicebear.com/9.x/pixel-art/svg?seed=Mackenzie","https://api.dicebear.com/9.x/pixel-art/svg?seed=Alexander","https://api.dicebear.com/9.x/pixel-art/svg?seed=Liliana"]},{name:"Iconos",avatars:["https://api.dicebear.com/9.x/icons/svg?seed=Brian","https://api.dicebear.com/9.x/icons/svg?seed=Vivian","https://api.dicebear.com/9.x/icons/svg?seed=Avery","https://api.dicebear.com/9.x/icons/svg?seed=Oliver","https://api.dicebear.com/9.x/icons/svg?seed=Chase","https://api.dicebear.com/9.x/icons/svg?seed=Kimberly","https://api.dicebear.com/9.x/icons/svg?seed=Luis","https://api.dicebear.com/9.x/icons/svg?seed=Emery","https://api.dicebear.com/9.x/icons/svg?seed=Christian","https://api.dicebear.com/9.x/icons/svg?seed=Jameson","https://api.dicebear.com/9.x/icons/svg?seed=Katherine","https://api.dicebear.com/9.x/icons/svg?seed=Leo","https://api.dicebear.com/9.x/icons/svg?seed=Sadie","https://api.dicebear.com/9.x/icons/svg?seed=Amaya","https://api.dicebear.com/9.x/icons/svg?seed=Mason","https://api.dicebear.com/9.x/icons/svg?seed=Wyatt","https://api.dicebear.com/9.x/icons/svg?seed=Jocelyn","https://api.dicebear.com/9.x/icons/svg?seed=Mackenzie","https://api.dicebear.com/9.x/icons/svg?seed=Alexander","https://api.dicebear.com/9.x/icons/svg?seed=Liliana"]}];function rt(d){p.value=d,Z.value=!1}return(d,r)=>{const j=x("v-img"),q=x("v-avatar"),N=x("font-awesome-icon"),M=x("v-btn"),he=x("v-card-title"),Q=x("v-tab"),Ae=x("v-tabs"),me=x("v-divider"),G=x("v-col"),se=x("v-row"),fe=x("v-card-text"),Te=x("v-spacer"),Pe=x("v-card-actions"),oe=x("v-card"),Ue=x("v-dialog"),I=x("v-text-field"),lt=x("v-textarea"),Y=x("v-window-item"),ct=x("v-window"),ut=x("v-snackbar"),dt=x("v-container");return ae(),Oe(dt,{class:"py-2 mt-4"},{default:u(()=>[i(se,{justify:"center"},{default:u(()=>[i(G,{cols:"12",md:"10"},{default:u(()=>[i(oe,{class:"pa-6",elevation:"10"},{default:u(()=>[i(se,null,{default:u(()=>[i(G,{cols:"12",class:"text-center"},{default:u(()=>[B("div",Gn,[i(q,{size:"120",class:"mx-auto mb-4"},{default:u(()=>[i(j,{src:_(p)},null,8,["src"])]),_:1}),i(M,{icon:"",small:"",color:"#2c3e50",style:{position:"absolute",bottom:"8px",right:"8px"},onClick:r[0]||(r[0]=c=>Z.value=!0)},{default:u(()=>[i(N,{icon:"camera",style:{color:"white"}})]),_:1}),i(Ue,{modelValue:Z.value,"onUpdate:modelValue":r[3]||(r[3]=c=>Z.value=c),"max-width":"600"},{default:u(()=>[i(oe,null,{default:u(()=>[i(he,{class:"text-h5",style:{"background-color":"#2c3e50",color:"white"}},{default:u(()=>[v(g(d.$t("perfil.seleccionarAvatar")),1)]),_:1}),i(Ae,{modelValue:pe.value,"onUpdate:modelValue":r[1]||(r[1]=c=>pe.value=c),"bg-color":"#2c3e50",dark:"","show-arrows":"",class:"mt-2"},{default:u(()=>[(ae(),Ne(Ie,null,Ce(ke,(c,ie)=>i(Q,{key:ie,value:ie,style:{"text-transform":"none","font-weight":"bold"}},{default:u(()=>[v(g(c.name),1)]),_:2},1032,["value"])),64))]),_:1},8,["modelValue"]),i(me),i(fe,null,{default:u(()=>[i(se,{dense:"",class:"justify-center"},{default:u(()=>[(ae(!0),Ne(Ie,null,Ce(ke[pe.value].avatars,(c,ie)=>(ae(),Oe(G,{key:ie,cols:"4",md:"3",class:"d-flex justify-center"},{default:u(()=>[i(q,{size:"80",class:"hover-avatar",onClick:Jn=>rt(c)},{default:u(()=>[i(j,{src:c},null,8,["src"])]),_:2},1032,["onClick"])]),_:2},1024))),128))]),_:1})]),_:1}),i(Pe,null,{default:u(()=>[i(Te),i(M,{text:"",color:"error",onClick:r[2]||(r[2]=c=>Z.value=!1)},{default:u(()=>[v(g(d.$t("perfil.cancelar")),1)]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),B("input",{type:"file",hidden:"",ref:"fileInput",onChange:it},null,544)]),B("h2",zn,g(_(l)),1),B("h4",null,g(_(a)),1)]),_:1})]),_:1}),i(me,{class:"my-6"}),i(Ae,{modelValue:L.value,"onUpdate:modelValue":r[4]||(r[4]=c=>L.value=c),"bg-color":"#2c3e50",dark:""},{default:u(()=>[i(Q,{value:"personal"},{default:u(()=>[i(N,{icon:"user",class:"mr-2"}),v(" "+g(d.$t("perfil.tabs.informacion")),1)]),_:1}),i(Q,{value:"contact"},{default:u(()=>[i(N,{icon:"phone",class:"mr-2"}),v(" "+g(d.$t("perfil.tabs.contacto")),1)]),_:1}),i(Q,{value:"address"},{default:u(()=>[i(N,{icon:"map-marker-alt",class:"mr-2"}),v(" "+g(d.$t("perfil.tabs.direccion")),1)]),_:1}),i(Q,{value:"security"},{default:u(()=>[i(N,{icon:"shield-alt",class:"mr-2"}),v(" "+g(d.$t("perfil.tabs.seguridad")),1)]),_:1}),i(Q,{value:"summary"},{default:u(()=>[i(N,{icon:"clipboard",class:"mr-2"}),v(" "+g(d.$t("perfil.tabs.resumen")),1)]),_:1})]),_:1},8,["modelValue"]),i(ct,{modelValue:L.value,"onUpdate:modelValue":r[22]||(r[22]=c=>L.value=c),class:"mt-4"},{default:u(()=>[i(Y,{value:"personal"},{default:u(()=>[i(I,{modelValue:_(o),"onUpdate:modelValue":r[5]||(r[5]=c=>re(o)?o.value=c:null),label:d.$t("perfil.informacion.nombreCompleto"),variant:"underlined",error:W.value,rules:[c=>!!c||"Este campo es obligatorio"]},null,8,["modelValue","label","error","rules"]),i(I,{modelValue:_(l),"onUpdate:modelValue":r[6]||(r[6]=c=>re(l)?l.value=c:null),label:d.$t("perfil.informacion.nombreUsuario"),variant:"underlined"},null,8,["modelValue","label"]),i(lt,{modelValue:_(h),"onUpdate:modelValue":r[7]||(r[7]=c=>re(h)?h.value=c:null),label:d.$t("perfil.informacion.descripcion"),variant:"underlined",counter:"",maxlength:qn,"auto-grow":""},null,8,["modelValue","label"]),i(M,{color:"#2c3e50",class:"mt-3",onClick:ne},{default:u(()=>[v(g(d.$t("perfil.guardar")),1)]),_:1})]),_:1}),i(Y,{value:"contact"},{default:u(()=>[i(I,{modelValue:_(m),"onUpdate:modelValue":r[8]||(r[8]=c=>re(m)?m.value=c:null),label:d.$t("perfil.contacto.telefono"),variant:"underlined",error:de.value,rules:[c=>/^\d{9}$/.test(c)||"Debe ser un teléfono válido"]},null,8,["modelValue","label","error","rules"]),i(M,{color:"#2c3e50",class:"mt-3",onClick:ne},{default:u(()=>[v(g(d.$t("perfil.guardar")),1)]),_:1})]),_:1}),i(Y,{value:"address"},{default:u(()=>[i(I,{modelValue:_(f).pais,"onUpdate:modelValue":r[9]||(r[9]=c=>_(f).pais=c),label:d.$t("perfil.direccion.pais"),variant:"underlined"},null,8,["modelValue","label"]),i(I,{modelValue:_(f).provincia,"onUpdate:modelValue":r[10]||(r[10]=c=>_(f).provincia=c),label:d.$t("perfil.direccion.provincia"),variant:"underlined"},null,8,["modelValue","label"]),i(I,{modelValue:_(f).localidad,"onUpdate:modelValue":r[11]||(r[11]=c=>_(f).localidad=c),label:d.$t("perfil.direccion.ciudad"),variant:"underlined"},null,8,["modelValue","label"]),i(I,{modelValue:_(f).codigo_postal,"onUpdate:modelValue":r[12]||(r[12]=c=>_(f).codigo_postal=c),label:d.$t("perfil.direccion.codigoPostal"),variant:"underlined"},null,8,["modelValue","label"]),i(I,{modelValue:_(f).calle,"onUpdate:modelValue":r[13]||(r[13]=c=>_(f).calle=c),label:d.$t("perfil.direccion.calle"),variant:"underlined"},null,8,["modelValue","label"]),i(I,{modelValue:_(f).numero,"onUpdate:modelValue":r[14]||(r[14]=c=>_(f).numero=c),label:d.$t("perfil.direccion.numero"),variant:"underlined"},null,8,["modelValue","label"]),i(I,{modelValue:_(f).piso,"onUpdate:modelValue":r[15]||(r[15]=c=>_(f).piso=c),label:d.$t("perfil.direccion.piso"),variant:"underlined"},null,8,["modelValue","label"]),i(M,{color:"#2c3e50",class:"mt-3",onClick:ne},{default:u(()=>[v(g(d.$t("perfil.guardar")),1)]),_:1})]),_:1}),i(Y,{value:"security"},{default:u(()=>[i(I,{modelValue:O.value,"onUpdate:modelValue":r[17]||(r[17]=c=>O.value=c),label:d.$t("perfil.seguridad.actual"),type:H.value?"text":"password",variant:"underlined"},{"append-inner":u(()=>[i(N,{icon:H.value?"eye-slash":"eye",style:{cursor:"pointer",color:"#2c3e50"},onClick:r[16]||(r[16]=c=>H.value=!H.value)},null,8,["icon"])]),_:1},8,["modelValue","label","type"]),i(I,{modelValue:k.value,"onUpdate:modelValue":r[19]||(r[19]=c=>k.value=c),label:d.$t("perfil.seguridad.nueva"),type:F.value?"text":"password",variant:"underlined"},{"append-inner":u(()=>[i(N,{icon:F.value?"eye-slash":"eye",style:{cursor:"pointer",color:"#2c3e50"},onClick:r[18]||(r[18]=c=>F.value=!F.value)},null,8,["icon"])]),_:1},8,["modelValue","label","type"]),i(I,{modelValue:R.value,"onUpdate:modelValue":r[21]||(r[21]=c=>R.value=c),label:d.$t("perfil.seguridad.confirmar"),type:X.value?"text":"password",variant:"underlined"},{"append-inner":u(()=>[i(N,{icon:X.value?"eye-slash":"eye",style:{cursor:"pointer",color:"#2c3e50"},onClick:r[20]||(r[20]=c=>X.value=!X.value)},null,8,["icon"])]),_:1},8,["modelValue","label","type"]),i(M,{color:"#2c3e50",class:"mt-3",onClick:at},{default:u(()=>[v(g(d.$t("perfil.seguridad.cambiar")),1)]),_:1}),i(me,{class:"my-6"}),B("div",Wn,[i(M,{color:"#e74c3c",onClick:st},{default:u(()=>[v(g(d.$t("perfil.seguridad.cerrarSesion")),1)]),_:1})])]),_:1}),i(Y,{value:"summary"},{default:u(()=>[i(oe,{class:"mb-6",color:"#fafafa",dark:""},{default:u(()=>[i(he,null,{default:u(()=>[v(g(d.$t("perfil.resumen.titulo")),1)]),_:1}),i(fe,null,{default:u(()=>[i(se,null,{default:u(()=>[i(G,{cols:"12",sm:"6"},{default:u(()=>[B("strong",null,g(d.$t("perfil.resumen.correo"))+":",1),v(" "+g(_(a)),1)]),_:1}),i(G,{cols:"12",sm:"6"},{default:u(()=>[B("strong",null,g(d.$t("perfil.resumen.tipo"))+":",1),v(" "+g(_(E)),1)]),_:1}),i(G,{cols:"12",sm:"6"},{default:u(()=>[B("strong",null,g(d.$t("perfil.resumen.saldo"))+":",1),v(" "+g(_(P))+" €",1)]),_:1}),i(G,{cols:"12",sm:"6"},{default:u(()=>{var c;return[B("strong",null,g(d.$t("perfil.resumen.ventas"))+":",1),v(" "+g(((c=_(A))==null?void 0:c.length)||0),1)]}),_:1}),i(G,{cols:"12",sm:"6"},{default:u(()=>{var c;return[B("strong",null,g(d.$t("perfil.resumen.compras"))+":",1),v(" "+g(((c=_(U))==null?void 0:c.length)||0),1)]}),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1}),i(ut,{modelValue:b.value.show,"onUpdate:modelValue":r[23]||(r[23]=c=>b.value.show=c),color:b.value.color,timeout:"3000"},{default:u(()=>[v(g(b.value.text),1)]),_:1},8,["modelValue","color"]),i(Ue,{modelValue:D.value,"onUpdate:modelValue":r[25]||(r[25]=c=>D.value=c),"max-width":"400"},{default:u(()=>[i(oe,null,{default:u(()=>[i(he,{class:"headline"},{default:u(()=>r[26]||(r[26]=[v("¿Cerrar sesión?")])),_:1}),i(fe,null,{default:u(()=>r[27]||(r[27]=[v("¿Estás seguro de que quieres cerrar sesión?")])),_:1}),i(Pe,null,{default:u(()=>[i(Te),i(M,{color:"#2c3e50",onClick:r[24]||(r[24]=c=>D.value=!1)},{default:u(()=>r[28]||(r[28]=[v("Cancelar")])),_:1}),i(M,{color:"#e74c3c",onClick:ot},{default:u(()=>r[29]||(r[29]=[v("Cerrar sesión")])),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})}}},Qn=yt(Kn,[["__scopeId","data-v-f777a220"]]);export{Qn as default};
