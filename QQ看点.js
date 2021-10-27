"ui";

//2.点击不可点击的控件
function position_click(x){
    let x1 = (x.bounds().right-x.bounds().left)* 3 / 4 + x.bounds().left;
    let y1 = (x.bounds().bottom-x.bounds().top)* 3 / 4 + x.bounds().top;
    if(x) click(x1, y1)
        else toastLog('无法中心点击');
}

//3.评论
function check_comment(input_words, choices, most_time, times_count) {
    let random_num = random(0, choices-1);
    let random_time = random(0, most_time);
    toastLog('随机时间：'+random_time+'秒');
    sleep(2000+random_time*1000);

    let widget_article = textContains("写评论").findOne(3000);
    let widget_video = descContains("发条友善的弹幕").findOne(3000);

    if(widget_article) {
        toastLog('处于文章中');
        widget_article.parent().click();
        toastLog('第'+times_count+'次发言');
        sleep(2000);
        setText(input_words[random_num]);
        sleep(1000);
        id('com.tencent.mobileqq.kandian_feature_impl:id/i4d').text('发表').click();
        sleep(3000);
        back();
        return true;
    }
        else if(widget_video){
            toastLog('处于视频中');
            sleep(2000);
            let video_comment_out_button = className('android.support.v7.widget.RecyclerView').findOne(3000);
            if(!video_comment_out_button) log('no');
            position_click(video_comment_out_button.child(0).child(0).child(0).child(1).child(0).child(0).child(1).child(0).child(4)
            );
            
            sleep(2000);
            let video_comment_in_button = id('com.tencent.mobileqq:id/input').findOne(3000);
            video_comment_in_button.click();
            toastLog('第'+times_count+'次发言');
            sleep(2000);
            setText(input_words[random_num]);
            sleep(1000);
            id('com.tencent.mobileqq.kandian_feature_impl:id/i4d').text('发表').click();
            sleep(2000);
            back();
            sleep(1000);
            back();
            return true;
        }
            else {back();sleep(1000);return false;};
}

//4.返回当前页面可用帖子
function return_real_windows() {
    let times = 0;
    let list_useable = new Array();
    let RecyclerView = className('android.support.v7.widget.RecyclerView').findOne(5000);
    if(!RecyclerView) {toastLog('当前页面找不到帖子');exit();};

    console.log('当前帖子数:'+RecyclerView.childCount());
    for(i = 0; i < RecyclerView.childCount(); i++){
        if(RecyclerView.child(i).bounds().top > RecyclerView.bounds().top && RecyclerView.child(i).bounds().bottom < RecyclerView.bounds().bottom){
            list_useable[times] = RecyclerView.child(i);
            times++;
        };
        }
    console.log('可用帖子数为:'+times);
    return list_useable;
}

//5.启动到论坛里
function startMain(channel) {
    home();
    sleep(1000);
    app.launch("com.tencent.mobileqq");
    sleep(1000);
    let kandian_text = id("com.tencent.mobileqq:id/kbi").text("看点").findOne(15000);
    if(kandian_text) kandian_text.parent().parent().click()
        else {toastLog('底框中没有“看点”，退出脚本');exit();};
    sleep(4000);

    let choose_channel = id("com.tencent.mobileqq:id/o_g").findOne(5000);
    if(choose_channel) position_click(choose_channel);
    sleep(2000);

    let into_channel = text(channel).findOne(5000);
    if(into_channel) position_click(into_channel);
    
}

//6.子线程 音量键关闭
threads.start(function(){
    //1.初始化 
    events.observeKey();
    events.onKeyDown("volume_up", function(){toastLog("音量+被按下,结束脚本！");sleep(1000);exit();});
});


ui.layout(
    <vertical padding="16">
        <text textSize="16sp" textColor="blue" text="提示"/>
        <text textSize="16sp" textColor="blue" text="1.确保qq关闭或者处于主界面"/>
        <text textSize="16sp" textColor="blue" text="2.按下音量+，结束脚本"/>

        <text textSize="16sp" textColor="black" text="频道名"/>
        <input id="channel" hint="比如'科技'"/>
        <text textSize="16sp" textColor="black" text="输入要说的话，会随机发出"/>
        <input id="words_1" hint="1."/>
        <input id="words_2" hint="2."/>
        <input id="words_3" hint="3."/>
        <input id="words_4" hint="4."/>
        <input id="words_5" hint="5."/>
        <text textSize="16sp" textColor="black" text="输入随机操作时间(最长)"/>
        <input id="time_most" hint="输入'5',0-5s内的随机一个时间"/>

        <button id='start' text="开始运行" textSize="20sp"/>
        <button id='save_config' text="保存配置" textSize="20sp"/>

    </vertical>
);
//指定确定按钮点击时要执行的动作
//频道
ui.start.click(function(){
    //通过getText()获取输入的内容
    var channel = ui.channel.getText();
    var most_time = ui.time_most.getText();
    var input_words = new Array();
    var choices = 0;
    for(i = 1; i < 6; i++){
        if(ui['words_'+i].getText() != '') {input_words[choices] = ui['words_'+i].getText();choices++;};
    }
    toastLog('输入了'+choices+'句话,开始执行');
    threads.start(function(){
        main(channel, input_words, choices, most_time);
    });
});

//保存配置
ui.save_config.click(function(){
    let save_channel = ui.channel.text();
    local_storage.put('channel_save', save_channel);

    for(i = 1;i < 6;i++){
        let save_words = ui['words_'+i].text();
        if(!save_words) continue;
        local_storage.put('save_words'+(i-1), save_words);
    }

    let save_time = ui.time_most.text();
    local_storage.put('time_save', save_time);

    toastLog('已保存配置');
});

//读取配置
var local_storage = storages.create("67here");

let channel_load = local_storage.get('channel_save');
if(channel_load) ui.channel.setText(channel_load);

for(i = 1; i < 6; i++){
    let words_load = local_storage.get('save_words'+(i-1));
    if(words_load) ui['words_'+i].setText(words_load);
}

let time_load = local_storage.get('time_save');
if(time_load) ui.time_most.setText(time_load);


//主函数
function main(channel, input_words, choices, most_time) {
    auto.waitFor();
    var times_count = 1;

    startMain(channel);
    toastLog('等待8秒');
    sleep(8000);

    while(1){
        var list1 = return_real_windows();
        for(p = 0; p < list1.length; p++){
            sleep(3000);
            position_click(list1[p]);
            sleep(2000);
            if(check_comment(input_words, choices, most_time, times_count)) times_count++;
        }
    sleep(1000);
    swipe(device.width/2, device.height/1.3, device.width/4, device.height/8, 2000);
    sleep(3000);
}
}
