//0.初始化  
auto.waitFor();
var dev_hight = device.height;
var dev_width = device.width;
var times = 1;
const {bili_uid} = hamibot.env;
if(!requestScreenCapture()){
    toast("请求截图失败");
    exit();}
threads.start(function(){
    events.observeKey();
 events.onKeyDown("volume_up", function(event){toastLog("\n音量+被按下，即将结束脚本！");sleep(3000);console.hide();exit();});
});
//1.点击控件 找不到报错
function sureclick(x) {if(x) return x.click();}
//2.直接跳转到某uid空间里
function jumpinto(bili_uid){
	var qucik_url = 'bilibili://space/' + bili_uid;
  app.startActivity({
  packageName: "tv.danmaku.bili",
	data: qucik_url,});
  sleep(1000);if(id('text3').text('我知道了').findOne(3000)) id('text3').text('我知道了').findOne(3000).click()
}
//3.检测是否红手
function check(Uiobject){
  let x = Uiobject.parent().child(Uiobject.indexInParent()+1).bounds().centerX();
  let y = Uiobject.parent().child(Uiobject.indexInParent()+1).bounds().centerY();
  let img = captureScreen();
  let color = images.pixel(img, x, y);
  if(colors.toString(color) == '#ffff7098') return false
  else return true;
}
//4.主工作
function mainwork(){
  sureclick(text('动态').clickable(true).findOne(8000));
  let up_name = id('tv.danmaku.bili:id/card_user_name').findOne(3000);
  if(up_name) log('up主:'+up_name.getText()+'\n按下音量+手动中止，不支持夜晚模式')
  else toastLog('未发现up主名字');
  while(1) {
    swipe(dev_width/2, dev_hight * 3/4, dev_width/2, dev_hight/4, 1000);sleep(1100);
    let like = boundsInside(0, dev_hight/5, dev_width, dev_hight*0.8).id('dy_card_like').findOne(1000);sleep(1000);
    if(!like) continue;
    if(check(like)) {sureclick(like);log('点'+times+++'次');sleep(500);}
    if(text('到达尽头了').exists()) return log('即将到达尽头，自动停止');
  }
}

sleep(1000);
toastLog('启动哔哩');
console.show();
home();sleep(2000);
jumpinto(bili_uid);
mainwork();
