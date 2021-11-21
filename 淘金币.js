auto();
var times_counts = show_text = into_flag = 1;
var dev_hight = device.height;
var dev_width = device.width;

//子线程 音量键关闭
threads.start(function(){
  events.observeKey();
 events.onKeyDown("volume_up", function(event){toastLog("\n音量+被按下，脚本结束！");sleep(1000);console.hide();exit();});
})


console.show();
home();sleep(2000);
log('跳转金币小镇中...');

app.startActivity({
packageName: "com.taobao.taobao",
data: 'taobao://pages.tmall.com/wow/z/tmtjb/town/task'
});

text('做任务赚金币').waitFor();log('页面加载完成');
while(1){
	sleep(3000);
	let btn = textMatches('去完成|去看看').find();
	for(i = 0; i < btn.length; i++){
	  sleep(3000);
	  show_text = btn[i].parent().child(0).child(0).text();
	  if(show_text.indexOf('消消乐') != -1) continue;
    if(show_text.indexOf('淘宝人生') != -1) continue;

	  log(times_counts+++'.'+show_text);
	  btn[i].click();sleep(3000);into_flag = 'use';
	  if(show_text.indexOf('天天领现金') != -1) {text('打开链接').waitFor();log('点领现金');text('打开链接').findOne().click();}
	  if(show_text.indexOf('小课堂') != -1) textContains('A.').findOne().click();
	  judge_wait('浏览10', 13);
	  if(textContains('下滑浏览').findOne(2000)) {
	    log('下滑中...');
	    for(i = 0; i < 7; i++){swipe(dev_width/2, dev_hight * 4/5, dev_width/2, dev_hight/5, 2000);sleep(2000);}
    }
	  while(!text('做任务赚金币').findOne(2000)) back();
	}
  if(into_flag == 'use') {
    sleep(3000);
    text('一键领取').findOne().click();
    log('领取');
    sleep(3000);
    into_flag = 'null';
  }
  else {log('任务全部完成');hamibot.exit();};
}

//判断等待
function judge_wait(keyword, seconds){
  sleep(3000);
	if(textContains(keyword).findOne(3000)) {log('等待'+seconds+'秒');sleep(seconds*1000);}
}
