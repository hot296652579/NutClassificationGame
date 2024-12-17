"use strict";exports.template=`
&nbsp&nbsp<ui-label value="要检测的资源目录 (如果未设置，则默认为当前项目的 assets 目录)"></ui-label><br/>
<ui-file class="inputAssetDir" type="directory"></ui-file><br/>
&nbsp&nbsp<ui-label value="输出结果目录 (检测结果输出到Creator控制台，同时也输出到文件，默认为当前项目的 build 目录)"></ui-label><br/>
<ui-file class="outFileDir" type="directory"></ui-file><br/>
<br/>&nbsp&nbsp<ui-button>保存</ui-button>
<br/><br/><br/><br/><br/>
&nbsp&nbsp<ui-label value="联系作者"></ui-label><br/>
&nbsp&nbsp&nbsp&nbsp<ui-label value="微信公众号：楚游香"></ui-label><br/>
&nbsp&nbsp&nbsp&nbsp<ui-label value="个人网站："></ui-label>
<ui-link>https://www.chuyouxiang.com</ui-link><br/>
&nbsp&nbsp<ui-label value="插件推荐"></ui-label><br/>
&nbsp&nbsp&nbsp&nbsp<ui-label value="无损批量图片压缩神器："></ui-label>
<ui-link>https://store.cocos.com/app/detail/5438</ui-link><br/>
&nbsp&nbsp&nbsp&nbsp<ui-label value="videoTexture视频播放："></ui-label>
<ui-link>https://store.cocos.com/app/detail/4711</ui-link><br/>
`,exports.style=`
ui-file {margin 55px 5% 5px;width:90%}
ui-input {margin 55px 5% 5px;width:80%}
ui-button {margin 5px 5% 5px;}
`,exports.$={inputAssetDir:".inputAssetDir",outFileDir:".outFileDir",btn:"ui-button"},exports.mothids={},exports.listeners={};const fs=require("fs");function setPath(e,t){t&&0<t.length&&(fs.existsSync(t)?(Editor.Profile.setProject("assetclean",e,t),console.log(`Success to save, key=${e}, path=<${t}>`)):console.error(`Failed to save, key=${e}, path=<${t}> no exist`))}function getValue(e){return e?Editor.Profile.getProject("assetclean",e):(console.log("getValue: Invalid key"),"")}exports.ready=async function(){this.$.btn.addEventListener("confirm",()=>{setPath("assetDir",this.$.inputAssetDir.value),setPath("outDir",this.$.outFileDir.value)});var e=await getValue("assetDir"),e=(e&&0<e.length&&(this.$.inputAssetDir.value=e),await getValue("outDir"));e&&0<e.length&&(this.$.outFileDir.value=e)},exports.beforeClose=async function(){},exports.close=async function(){};