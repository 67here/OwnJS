//0.初始化  
auto.waitFor();
//1.请求截图 autojs4.1用
if(!requestScreenCapture()){
    toast("请求截图失败");
    exit();}
//2.等待某某出现 作出反馈
function wait_sth(sth, showsth, nshowsth){
    if(sth) return toastLog(showsth);else return toastLog(nshowsth);}
//3.点击控件 找不到报错
function sureclick(x) {if(x) return x.click();else toastLog('未找到按钮');}
//4.检测是否在动态页面
function check_in(){
    let checkcard = id('tv.danmaku.bili:id/support_icon').findOne(8000);
    let card_end = boundsInside(0, dev_hight/2, dev_width, dev_hight).id('tv.danmaku.bili:id/title').text('到达尽头了').exists();
    if(!(checkcard)) {toastLog('未发现大拇指 退出');exit();};
    if(card_end) {toastLog('点赞完成！'); exit();};
}
//5.检测有无赞按钮 自动处理并反馈
function check_and_zan(){
    let cardlike = boundsInside(0, dev_hight/5, dev_width, dev_hight).id('tv.danmaku.bili:id/card_like').findOne(1000);
    if(!cardlike) return 0;
    let x1 = cardlike.bounds().left+cardlike.bounds().width()*0.33;
    let y1 = cardlike.bounds().top+cardlike.bounds().height()*0.51;
    let img = captureScreen();
    if(y1 >= img.getHeight() || y1 <= 0) return 0;
    let color = images.pixel(img, x1, y1);
    if(colors.toString(color) == '#ffff7098') return 0;
        else {sureclick(cardlike);return 1;}}
//6.点击不可点击的控件
function position_click(x){if(x) click(x.bounds().centerX(), x.bounds().centerY());else toastLog('无法中心点击');}

//7.直接跳转到某uid空间里
function jumpinto(bili_uid){
	var qucik_url = 'bilibili://space/' + bili_uid;
  app.startActivity({
  packageName: "tv.danmaku.bili",
	data: qucik_url,});
  let skip_qsn = id('tv.danmaku.bili:id/text3').text('我知道了').findOne(3000)
  if(skip_qsn) click(skip_qsn);
}

//8.进入动态后的自动循环与显示等操作
function mainwork(swipe_time, sleep_time){
  sureclick(text('动态').clickable(true).findOne(8000));
  let up_name = id('tv.danmaku.bili:id/card_user_name').findOne(3000);
  if(up_name) toastLog('up主:'+up_name.getText());else toastLog('未发现up主名字');
  console.show();
  toastLog('按下音量+ 可手动停止');

  check_and_zan();
  while(1) {
      if (check_and_zan()) toastLog('点赞第'+times+++'次');
      swipe(dev_width/2, dev_hight * 3/4, dev_width/2, dev_hight/4, swipe_time);sleep(sleep_time);
      check_in();}
}
//9.子线程 音量键关闭
threads.start(function(){
    events.observeKey();
 events.onKeyDown("volume_up", function(event){toastLog("\n音量+被按下，即将结束脚本！");sleep(3000);console.hide();exit();});
});

//二次初始化：
var dev_hight = device.height;
var dev_width = device.width;
if(dev_hight && dev_width == 0) {toastLog('BUG啦，请重启手机');exit();}

var times = 1;

const {run_speed_mode} = hamibot.env;
const {wait_atime} = hamibot.env;
//mode 1 = 自由模式 ；mode 2 = 单人uid模式
const {mode_select} = hamibot.env;
const {bili_uid} = hamibot.env;


switch(run_speed_mode){
  case '1_0X':toastLog('当前设定1倍速');main_1 = 1000;main_2 = 1000;break;
  case '2_0X':toastLog('当前设定2倍速');main_1= 500;main_2 = 500;break;
  case 'fly':toastLog('当前处于起飞模式 谨慎选择');main_1= 500;main_2 = 100;break;
}


if (mode_select == 'mode1'){
  toastLog('当前处于自由模式');
  sleep(2000);
  toastLog('请切换到某位up的首页\n'+wait_atime+'秒后开始');
  sleep(wait_atime*1000 + 5000);
	mainwork(main_1, main_2);
};

if (mode_select == 'mode2'){
	toastLog('当前处于指定uid模式');
	sleep(1000);
  toastLog('启动哔哩哔哩');
	sleep(1000);
	jumpinto(bili_uid);
  mainwork(main_1, main_2);
};
