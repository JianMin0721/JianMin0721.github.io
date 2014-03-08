---
layout: post
cTitle: Aspx用Form表單Post資料到Asp時中文亂碼問題
ctitle: Aspx用Form表單Post資料到Asp時中文亂碼問題
category : Dot Net
tags: [Aspx,Asp]
published: true
---

<p>因為工作上的需求，必須把客戶的網頁擺在公司的主機上，但是客戶的網頁是Asp，公司用的是Aspx，主管交代要改寫成是Aspx，需要改寫程式碼~(雖然好像是可以直接放在IIS上，改IIS設定，但沒有十足把握!所以還是改寫)。</p>

<!-- more -->

<p>改寫的過程中發現出現問題了，如同標題所寫的，"在Aspx網頁送出表單到Asp時發生接收中文字編碼錯誤，收到的是一堆亂碼。網路上找了下，原因出在於 <label>Aspx預設編碼是utf-8 </label>，而 <label>Asp是預設編碼big5 </label>。"</p>

<pre>
	<code>
		&lt;meta http-equiv="Content-Type" content="text/html; charset=utf-8" /&gt;
	</code>
</pre>
	
<p>有想說把上面的那行utf-8，改成big5。可惜還是失敗!</p>

<br>
<p>知道了原因，我便試圖用<label>javascript的escape、encodeURI、encodeURIComponent</label>去處理中文字，送到Asp網頁，發送成功，但是客戶收到，發現還是中文字是亂碼。</p>

<p>直接用javascript處裡中文字串失敗，我便嘗試著用 Server code來解決，也就是說把中文字用Ajax傳回Server，從新編碼後，在吐回clinent端在發送。可惜的是，還是不行。在google search下，有人用html的方法解決。</p>

<p>我把網頁個格式還有附檔名改成.html後，一切就沒問題了。所以目前我用的解法，應該是用Html+javascript+Ajax傳回Server從新編碼，在回傳client，送出表單。或者看有沒有好心人士做出 javascript版本 <label>UTF-8轉BIG5</label> 的程式碼來解決!</p>

<p>一切的前提是，在不要求客戶改程式碼和不改動Server上的IIS設定下! XD~</p>