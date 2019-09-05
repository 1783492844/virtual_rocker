---


---

<h2 id="简介">简介</h2>
<p>这是一个简单的CocosCreator虚拟摇杆demo</p>
<h2 id="种模式">3种模式</h2>
<ol>
<li>轮盘呼出模式 showMode<br>
[1] 固定位置 FIXED<br>
[2] 在限定区域呼出 FOLLOW</li>
<li>玩家移动模式 moveMode<br>
[1] 固定速度 FIXED<br>
[2] 随摇杆到轮盘中心距离变化 CHANGED</li>
<li>玩家越界模式 crossMode<br>
[1] 禁止越界 FORBID<br>
[2] 运行越界（即从另一侧出来）PERMIT</li>
</ol>
<h2 id="注意事项">注意事项</h2>
<ol>
<li><strong>rocker节点的size需要设置</strong>，不能为0，不然无法触发触摸事件</li>
<li>如果<strong>使用限制区域</strong>，则<strong>必须</strong>要让rocker节点成为限制区域节点的子节点，此操作涉及轮盘呼出的位置问题（坐标系错误，导致轮盘位置不对）</li>
<li>如果<strong>不使用限制区域</strong>，则不能使用轮盘呼出的跟随模式，否则会报错</li>
</ol>
<h2 id="使用方法">使用方法</h2>
<ol>
<li>下载virtual_rocker根目录下的<strong>virtual_rocker.zip</strong>压缩包，然后导入到自己的工程文件，具体操作<a href="https://docs.cocos.com/creator/manual/zh/asset-workflow/import-export.html"># 资源导入导出工作流程</a></li>
<li>将rocker预制体拖拽到想要的位置</li>
<li>设置好limitArea节点的大小</li>
<li>设置rocker节点的大小，rocker组件<br>
<img src="https://lh3.googleusercontent.com/Sy60GXiKaBAFt3E9fsXDruc69FFX0YQS5m7Jkk5F3hrkP9RZJdgG4kUiSHZ4oMNpLI9lQSLl97zb" alt="enter image description here" title="rocker属性"></li>
</ol>
<h2 id="rocker节点属性说明">rocker节点属性说明</h2>
<blockquote>
<p><strong>Node组件</strong></p>
</blockquote>
<p><strong>Size属性必须要设置大小</strong></p>
<blockquote>
<p><strong>rocker组件</strong></p>
</blockquote>
<ul>
<li>Limit Area Node 限制区域节点（<em>非必须</em>），如果使用，则<strong>该节点必须是rocker节点的父节点</strong>；如果不使用，则不能使用showMode的FOLLOW模式，否则会报错</li>
<li>Player Node 玩家节点（<em><strong>必须</strong></em>）</li>
<li>Move Speed Max 玩家移动速度最大值</li>
</ul>
<blockquote>
<p><strong>Widget组件</strong></p>
</blockquote>
<p>此组件用于虚拟摇杆默认固定位置的确定（<em><strong>必须</strong></em>）</p>

