---
layout: post
cTitle: Android用WebService取資料並更新UI
ctitle: Android用WebService取資料並更新UI
category : Android
tags: [Android,Web Service]
published: true
---

<p>在Android中如何跟遠端SQL去要資料，在顧慮安全性的情形下，直接去跟資料庫作互動不安全的，因為APP是安裝在User的手機上，所以你的連線資料會存在N份User行動裝置上，在安全性的風險上較高。</p>

<p>那麼比較好的方法，是用 <label>Web Service</label>或者<label>WebApi</label>，透過他們跟資料庫做存取資料的動作。</p>

<!-- more -->

<p>我們透過 getData() 這個函數去跟 Web Service 要資料，Web Service的寫法和SQL皆略過，網路上不少資料。</p>

<br/>

<pre class="code">

<span class="codeline"><b class="codehtmltag">public String getData(){</b></span>
<span class="codeline"><b class="codehtmltag">    String str = "";</b></span>
<span class="codeline"><b class="codehtmltag">    String url = "http://192.168.0.2:10000/default.aspx?id=Frank";</b></span>
<span class="codeline"><b class="codehtmltag">    HttpGet httpget = new HttpGet(url);</b></span>
<span class="codeline"><b class="codehtmltag">    try{</b></span>
<span class="codeline"><b class="codehtmltag">        HttpResponse res = new DefaultHttpClient ().execute(httpget);</b></span>
<span class="codeline"><b class="codehtmltag">        if ( res.getStatusLine( ) .getStatusCode( ) == 200 ){</b></span>
<span class="codeline"><b class="codehtmltag">            </b></span>
<span class="codeline"><b class="codehtmltag">                 str = EntityUtils.toString( res.getEntity( ) ) ;</b></span>
<span class="codeline"><b class="codehtmltag">        }</b></span>
<span class="codeline"><b class="codehtmltag">        catch(Exception e){</b></span>
<span class="codeline"><b class="codehtmltag">            str=e.getMessage();</b></span>
<span class="codeline"><b class="codehtmltag">        }</b></span>
<span class="codeline"><b class="codehtmltag">        return str;</b></span>
<span class="codeline"><b class="codehtmltag">    }</b></span>
<span class="codeline"><b class="codehtmltag">}</b></span>

</pre>
<br/>
<p>其中回傳的str 就是我們的要的資料了，格式可以是Json或者是XML格式，本例是用Json，透過Android內建的解Json套件，引用<label>import org.json.*;</label>，再加上底下的方法，就能夠把資料轉成我們要的物件格式了。</p>
<br/>
<pre class="code">
<span class="codeline"><b class="codehtmltag">private JSONArray ParseJson (String result) {</b></span>
<span class="codeline"><b class="codehtmltag">	JSONArray jsonArray;</b></span>
<span class="codeline"><b class="codehtmltag">	try {</b></span>
<span class="codeline"><b class="codehtmltag">		jsonArray = new JSONArray(result);</b></span>
<span class="codeline"><b class="codehtmltag">	}</b></span>
<span class="codeline"><b class="codehtmltag">	catch (JSONException e) {</b></span>
<span class="codeline"><b class="codehtmltag">		// TODO Auto-generated catch block</b></span>
<span class="codeline"><b class="codehtmltag">		e.printStackTrace();</b></span>
<span class="codeline"><b class="codehtmltag">		jsonArray=null;</b></span>
<span class="codeline"><b class="codehtmltag">	}</b></span>
<span class="codeline"><b class="codehtmltag">	return jsonArray;</b></span>
<span class="codeline"><b class="codehtmltag">}</b></span>
</pre>
<br/>
<p>如何更新使用者的UI呢?直接改!?NO~!NO~!NO~!直接會報錯，然後APP當掉，強制結束APP。為什麼呢?原因在於 Android 4.0 版本後，不允許在有網路傳輸上的動作上，直接在主執行緒裡面，直接去改動U正在使用的UI介面。很合理的事情!在網路處裡的時候Lock使用者的UI，不讓User去做別的事情，是個不直觀的UX~!
</p>
<p>
而常用的解決方案有兩個，其一，使用多執行緒(thread)並行執行，主執行緒繼續動作，多開另外的執行緒去做網路處理，等到完畢後，把結果回傳主執行緒，去更改UI。另外一個就是異步任務(AsyncTask)，在主執行緒執行，裡面有開始前、開始執行、結束後和取消後的動作，我們只要改寫它就行了!</p>

<p>底下是 AsyncTask 的程式碼:(練習用的)</p>
<br/>
<pre class="code">

<span class="codeline"><b class="codehtmltag">class GoodTask extends AsyncTask&lt;Integer, Integer, String&gt; {</b></span>
<span class="codeline"><b class="codehtmltag">    @Override</b></span>
<span class="codeline"><b class="codehtmltag">    protected String doInBackground(Integer... arg0) {</b></span>
<span class="codeline"><b class="codehtmltag">        String tempString =getData().toString();</b></span>
<span class="codeline"><b class="codehtmltag">        //用於執行較長時間的後台計算。</b></span>
<span class="codeline"><b class="codehtmltag">        return tempString;</b></span>
<span class="codeline"><b class="codehtmltag">    }</b></span>
<span class="codeline"><b class="codehtmltag">    @Override</b></span>
<span class="codeline"><b class="codehtmltag">    protected void onPostExecute(String result) {</b></span>
<span class="codeline"><b class="codehtmltag">        super.onPostExecute(result);</b></span>
<span class="codeline"><b class="codehtmltag">        //當後台計算結束時，調用 UI線程。</b></span>
<span class="codeline"><b class="codehtmltag">        txthello.setText("");</b></span>
<span class="codeline"><b class="codehtmltag">	      </b></span>
<span class="codeline"><b class="codehtmltag">	      JSONArray obj = ParseJson(result);</b></span>
<span class="codeline"><b class="codehtmltag">	      try </b></span>
<span class="codeline"><b class="codehtmltag">	      {</b></span>
<span class="codeline"><b class="codehtmltag">	      if (advTemp==null){</b></span>
<span class="codeline"><b class="codehtmltag">	          advTemp= new ArrayList &lt; Advobj &gt; ();</b></span>
<span class="codeline"><b class="codehtmltag">	      }</b></span>
<span class="codeline"><b class="codehtmltag">	      for(int i = 0; i &lt; obj.length();i++)</b></span>
<span class="codeline"><b class="codehtmltag">        {</b></span>
<span class="codeline"><b class="codehtmltag">            String id = String.valueOf(i);</b></span>
<span class="codeline"><b class="codehtmltag">                JSONObject data = obj.getJSONObject(i);</b></span>
<span class="codeline"><b class="codehtmltag">                Advobj a =new Advobj();</b></span>
<span class="codeline"><b class="codehtmltag">                a.AdvID=data.getString("AdvertiserID");</b></span>
<span class="codeline"><b class="codehtmltag">                a.AdvName=data.getString("AdvertiserName");</b></span>
<span class="codeline"><b class="codehtmltag">                advTemp.add(a);</b></span>
<span class="codeline"><b class="codehtmltag">            }</b></span>
<span class="codeline"><b class="codehtmltag">            //更改UI</b></span>
<span class="codeline"><b class="codehtmltag">            SetList(advTemp);</b></span>
<span class="codeline"><b class="codehtmltag">        }</b></span>
<span class="codeline"><b class="codehtmltag">        catch (JSONException e) </b></span>
<span class="codeline"><b class="codehtmltag">        {</b></span>
<span class="codeline"><b class="codehtmltag">            e.printStackTrace();</b></span>
<span class="codeline"><b class="codehtmltag">        }</b></span>
<span class="codeline"><b class="codehtmltag">    }</b></span>
<span class="codeline"><b class="codehtmltag">}</b></span>


</pre>
<br/>

<p>然後我們在SetList()這個方法內，再去改UI介面設定，就完成了更新使用者UI的介面!感覺好像沒啥講解到~XD!</p>

<p>如有錯誤請留言，我會盡速修正!感謝!</p>