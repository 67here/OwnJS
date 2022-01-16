var show_screen = threads.start(function(){
    var w = floaty.rawWindow(<text text='running...' textSize="16sp" textColor="#f44336"/>);
    w.setTouchable(false);
    setTimeout(()=>{w.close();}, 172800000);
  });

while(1){
  sleep(5000);
  if(packageName('com.google.android.youtube').text('跳过广告').exists()) {
    toastLog('我跳！！！');
    desc('跳过广告').findOne().parent().click();
  }
}

