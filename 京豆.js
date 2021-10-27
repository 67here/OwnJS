'ui';
auto();
var times_count = 1;
//点击不可点击的控件
function position_click(x){if(x) click(x.bounds().centerX(), x.bounds().centerY())
  else toastLog('找不到此控件');}
//子线程 音量键关闭
threads.start(function(){
  events.observeKey();
 events.onKeyDown("volume_up", function(event){toastLog("\n音量+被按下，结束脚本！");sleep(1000);console.hide();exit();});
});

//0.启动并进入任务列表
function getInto(){
  log('启动京东');
  home();
  sleep(1000);
  app.launch('com.jingdong.app.mall');
  sleep(1000);
  app.startActivity({
    packageName: "com.jingdong.app.mall",
    data: 'openjd://virtual?params={"category":"jump","des":"m","url":"https://h5.m.jd.com/rn/42yjy8na6pFsq1cx9MJQ5aTgu3kX"}'
  });
  sleep(3000);
  textContains('签').waitFor();
  sleep(1000);
  log('页面Ready!');
  sleep(2000);

  let button_ancestor = className('android.webkit.WebView').text('领京豆').findOne(3000);
  if(button_ancestor) log('按钮Ready!\n')
    else return log('error1: no button ancestor');
sleep(2000); 
  //“升级赚京豆”
  button_zuan = button_ancestor.child(1).child(0).child(0).child(0).child(0).child(0).child(0).child(0).child(0).child(0).child(0).child(0).child(1).child(1).child(2);
  //“摇京豆”
  button_yao = button_ancestor.child(1).child(0).child(0).child(0).child(0).child(0).child(0).child(0).child(0).child(0).child(0).child(0).child(1).child(1).child(4);

}
//环节1:赚京豆
//赚京豆 环节
function zuan_task() {
  position_click(button_zuan);
  sleep(2000);
  while(1){
  sleep(2000);
  let will_click = text('去完成').findOne(2000);
  let will_click_2 = text('已完成').findOne(2000);

  if (!will_click && will_click_2) return log('环节1 赚京豆完成');
  if(will_click){
    	sleep(500);
      let will_text = will_click.parent().child(1).child(0).text();
      log(times_count+++'.'+will_text);position_click(will_click);sleep(3000);back();
  }
  check_where();
  }
}
//检查环节
function check_where(){
  while(1){
  if(textMatches('去完成|已完成').findOne(2000)) return log('列表~')
  		else if(text('领京豆').findOne(1000)) {toastLog('发现处于京东首页');getInto();sleep(3000);position_click(button_zuan);sleep(2000);}
  			else if(packageName('com.jingdong.app.mall').exists()) {back();sleep(1000);toastLog('尝试返回');}
  				else if(packageName('com.tencent.mm').exists()) {back();sleep(1000);back();toastLog('检测到跳转微信 尝试返回');}
  					else {toastLog('检测到已经离开京东！ 正在返回');getInto();sleep(3000);position_click(button_zuan);sleep(2000);}
  }
}
//环节2:摇金豆
function getInto_yao_list() {
  sleep(1000);
  getInto();
  sleep(1000);
  position_click(button_yao);
  log('等待进入页面:摇京豆')
  className("android.widget.Image").text("7d0db2f18e2bf7b7").waitFor();
  sleep(1000);

  let first_click = textContains('立即签到').findOne(2000);
  if(first_click) {
    log('开始首次签到');
    first_click.click();
    getInto();
    sleep(2000);
    position_click(button_yao);
  }
  log('等待进入列表:摇京豆');
  className("android.view.View").clickable(true).depth(13).waitFor();
  className("android.view.View").clickable(true).depth(13).findOne().click();
}

function yao_task() {
  sleep(2000);
  while(1){
  let will_click = text('浏览').findOne(2000);
  if (!will_click) return log('环节2 摇京豆完成');
  log(will_click.parent().child(1).child(0).getText());
  will_click.click();sleep(3000);
  back();
  while(!text('已浏览').findOne(2000)) back();
  };
}

//环节3 摇一摇
function yao_and_yao() { 
  sleep(1000);
  getInto();
  sleep(1000);
  position_click(button_yao);
  log('等待进入页面:摇京豆');
  textContains("摇出").waitFor();
  log('已进入');
  sleep(1000);
  while(1){
    sleep(1000);
		if(textContains("摇一摇").findOne(4000)) {sleep(1000);textContains("摇一摇").findOne(100).click();}
    	else break;
    sleep(1000);
    while(1){
			if(text("再摇一次").findOne(4000)) {text("再摇一次").findOne().click();sleep(1000);}
      	else break;
    	}
    back();log('等待回到领豆页面');
    sleep(3000);
    if(text("放弃领取").findOne(3000)) text("放弃领取").findOne().click();
    while(!className('android.webkit.WebView').text('领京豆').findOne(3000)) back();
    sleep(2000);
    position_click(button_yao);
  }
}
//环节4 全民运动
function quanmin_task(){
  log('启动京东');
  home();
  sleep(1000);
  app.launch('com.jingdong.app.mall');
  sleep(1000);
  app.startActivity({
      packageName:'com.jingdong.app.mall',
      data:'openjd://virtual?params={"category":"jump","des":"m","sourceValue":"babel-act","sourceType":"babel","url":"https://pro.m.jd.com/mall/active/tGjVPUhUvT8KxovWYjgq2Hfvmaa/index.html"}'
      }); 
  
  while(!textContains('攒卡币').findOne(3000)) click(device.width/2, device.height/2);
  
  sleep(3000);
  if(text('我知道了').findOne(3000)) text('我知道了').findOne(3000).click();
  log('页面Ready');
  text('剩余').waitFor();
  log('按钮Ready');
  click(device.width/2, device.height/2);
  sleep(4000);
  text('剩余').findOne(1000).parent().child(9).click();
  times_count = 1;
  while(1){
      sleep(2000);
      let text_btn = textMatches('.+6秒.+|成功浏览可得.+|浏览并关注.+|浏览可得.+').findOne(4000);
    	if(text_btn.parent().child(text_btn.parent().childCount()-1).text() == '已完成') break;
      if(text_btn) {
          sleep(2000);
          log(times_count+++'.'+text_btn.parent().child(1).text());
          text_btn.parent().child(text_btn.parent().childCount()-1).click();
          sleep(9000);
          back();
          sleep(2000);
      }
      else break;
  }
  log('\n全民活动已完成\n请手动领取奖励吧');
  }
ui.layout(
    <scroll>
    <vertical padding="16">
        <text textSize="16sp" textColor="blue" text="提示"/>
        <text textSize="16sp" textColor="blue" text="按下音量+，结束脚本"/>

        <checkbox text="环节1：赚京豆" id="ck_zuan_task" checked='true' />

        <checkbox text="环节2：摇京豆" id="ck_yao_task" checked='true' />

        <checkbox text="环节3：全民运动会(测试)" id="ck_quanmin_task" checked='true' />

        <button id='start' text="开始运行" textSize="20sp"/>
    </vertical>
    </scroll>
)
ui.start.click(function(){
    threads.start(function(){
        var button_zuan = button_yao = null;
        console.show();
        if (ui.ck_zuan_task.checked) {
          log('执行环节1 领京豆');
          getInto();
          zuan_task();
        }  
        if (ui.ck_yao_task.checked) {
          log('执行环节2 摇京豆');
          getInto_yao_list();
          yao_task();
      
          log('\n执行环节2.1 摇一摇');
          yao_and_yao();
          log('脚本结束');
        }
        if (ui.ck_quanmin_task.checked) {
          log('\n执行环节3 全民运动会');
          quanmin_task();
        }

        log('设定任务全部完成');
        exit();
    });
})
