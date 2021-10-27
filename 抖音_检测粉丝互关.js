'ui';
ui.layout(
    <scroll>
    <vertical padding="16">
        <text textSize="16sp" textColor="blue" text="提示"/>
        <text textSize="16sp" textColor="blue" text="1.按下音量+，结束脚本+自动复制结果"/>
        <text textSize="16sp" textColor="blue" text="2.检查完毕后，自动复制结果"/>


        <button id='system_setting' text="开启无障碍" textSize="20sp"/>

        <horizontal>
            <text textSize="16sp" textColor="red" text="1.连续检测"/>
            <input id="num_pages" inputType="number"/>
            <text textSize="15sp" textColor="red" text="页粉丝没有新互关，视为检查完毕"/>
        </horizontal>

        <horizontal>
            <button id='start' text="自动检测互关" textSize="20sp"/>
            <button id='cancel' text="自动取关" textSize="20sp"/>
        </horizontal>
    </vertical>
    </scroll>
)
var dev_hight = device.height;
var dev_width = device.width;
if(!dev_width) {toastLog('BUG啦，请重启手机');exit();}
var flag = pages_count = 1;
var times = 0;
var content = '';

ui.system_setting.click(function(){
    auto();
    if (floaty && floaty.hasOwnProperty("checkPermission") && !floaty.checkPermission()) {
        floaty.requestPermission(); toast("请先开启悬浮窗权限再运行,否则无法显示提示"); exit()
    }
})

ui.cancel.click(function(){
    threads.start(function(){
        console.show();
        // 进入关注列表
        sleep(1000);home();sleep(1000);
        app.launchPackage('com.ss.android.ugc.aweme');sleep(1000);
        while(!id('jv6').text('我').findOne(2000)) {log('返回1次');back();}
        log('回到首页');sleep(2000);
        id('jv6').text('我').findOne(2000).parent().parent().parent().click();
        sleep(2000);text('关注').findOne(3000).parent().click();
        sleep(2000);log('已进入关注列表');

        while(1){
            let btn_1 = id('aim').textMatches('已关注|互相关注').find();
            if(btn_1.length < 2) {log('取关完毕，脚本结束');exit();}
            for(i = 0; i < btn_1.length; i++){
                sleep(1000);btn_1[i].parent().click();
                if(text('取消关注').findOne(2000)) text('取消关注').findOne(3000).click();
            }
            sleep(1000);swipe(dev_width/2, dev_hight*7/8, dev_width/2, dev_hight/8, 3000);sleep(4000);
        }
    })
})

ui.start.click(function(){
    var pages = ui.num_pages.text();

    threads.start(function(){
        console.show();
        // 进入粉丝列表
        sleep(1000);home();sleep(1000);
        app.launchPackage('com.ss.android.ugc.aweme');sleep(1000);
        while(!id('jv6').text('我').findOne(2000)) {log('返回1次');back();}
        log('回到首页');sleep(2000);
        id('jv6').text('我').findOne(2000).parent().parent().parent().click();
        sleep(2000);text('粉丝').findOne(3000).parent().click();
        sleep(2000);log('已进入粉丝列表');
        // 开始选择，输出
        while(1){
            let btn = clickable(true).desc('互相关注，按钮').find();
            for(i = 0; i < btn.length; i++){
                sleep(1000);
                if(content.indexOf(btn[i].parent().parent().parent().child(1).child(0).child(0).text()) != -1) {log('重复，下一个');continue;}
                btn[i].parent().parent().parent().click();
                sleep(1000);times++;
                let new_content = id('guq').findOne(3000).text()+'+'+id('lve').findOne(3000).text().slice(4)+'\n';
                content = content + new_content;
                log(new_content);
                sleep(1000);back();
                flag = 0;
            }
            if(flag) {
                if(pages_count++ == pages) {toastLog(pages+'页没有新互关，脚本停止并复制');sleep(1000);content = content +'总数:'+ times;setClip(content);exit();}
                log('此页没有新的互关');  
            }
            else flag = pages_count = 1;
            sleep(1000);swipe(dev_width/2, dev_hight*7/8, dev_width/2, dev_hight/8, 3000);sleep(4000);
        }
    })

})

//子线程 音量键关闭
threads.start(function(){
    events.observeKey();
    events.onKeyDown("volume_up", function(){toastLog("音量+被按下,脚本结束，自动复制检测结果");sleep(1000);content = content +'总数:'+ times;setClip(content);exit();});
})
