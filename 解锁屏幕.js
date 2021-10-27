'ui';
var content_add;
ui.layout(
    <scroll>
    <vertical padding="16">
        <text textSize="16sp" textColor="blue" text="提示："/>
        <text textSize="16sp" textColor="blue" text="一、目前只支持点按的密码(比如数字密码)"/>

        <text textSize="16sp" textColor="blue" text="二、获取坐标的方法："/>
        <text textSize="16sp" textColor="blue" text="1)开发者模式中的“显示指针位置”"/>
        <text textSize="16sp" textColor="blue" text="2)已知屏幕分辨率，尺子量都可"/>

        <text textSize="16sp" textColor="blue" text="三、填写示范：假设密码是3个数字"/>
        <text textSize="16sp" textColor="black" text="100,200"/>
        <text textSize="16sp" textColor="black" text="200,350"/>
        <text textSize="16sp" textColor="black" text="300,450"/>
  
        <text textSize="16sp" textColor="blue" text="四、滑动距离默认为0.6倍的屏幕长度"/>
  
        <text textSize="16sp" textColor="red" text="1.点亮屏幕后："/>
        <horizontal>
          <text textSize="16sp" textColor="red" text="滑动"/>
          <input id="swipe_count" inputType="number" textSize="16sp"/>
          <text textSize="16sp" textColor="red" text="次屏幕，滑动时间为"/>
          <input id="swipe_time" inputType="number" textSize="16sp"/>
          <text textSize="16sp" textColor="red" text="毫秒"/>
        </horizontal>
  
        <text textSize="16sp" textColor="red" text="2.请填写数字坐标(至少2位密码)"/>
        <input id="origin" textSize="16sp" hint="如示例所示：XY坐标之间用逗号隔开，每组坐标之间用回车隔开，无密码则不填"/>

        <button id='save' text="保存配置" textSize="20sp"/>
        <button id='start' text="测试运行" textSize="20sp"/>

        <text textSize="16sp" textColor="black" text="保存结果："/>
        <text id="output"></text>
    </vertical>
    </scroll>
)

ui.save.click(function(){
    content_add = '';
    let save_origin = ui.origin.text();
    let swipe_count = ui.swipe_count.text();
    let swipe_time = ui.swipe_time.text();

    storage.put('save_origin', save_origin); 
    storage.put('swipe_count', swipe_count);   
    storage.put('swipe_time', swipe_time);   

    var array = convert_string(save_origin)
    if(!save_origin) add_display('保存为无密码')
    else {
        add_display('成功保存了'+array.length+'位密码:');
        for(i = 0; i < array.length; i++){add_display('第'+(i+1)+'位 横坐标:'+array[i][0]+'纵坐标:'+array[i][1]);}
    };
});

ui.start.click(function(){
    ui.output.setText('即将测试，请在5秒内按下电源键！！！'); 
    let save_origin = ui.origin.text();
    let swipe_count = ui.swipe_count.text();
    let swipe_time = ui.swipe_time.text();
    unlock_array = convert_string(save_origin);    
    threads.start(function(){sleep(6000);ui.output.setText('成功了没>_<');unlock_screen(unlock_array, swipe_count, swipe_time);});

});

//读取配置
var storage = storages.create("67pwd");
if(storage.get("save_origin")) ui.origin.setText(storage.get("save_origin"));
if(storage.get("swipe_count")) ui.swipe_count.setText(storage.get("swipe_count"));
if(storage.get("swipe_time")) ui.swipe_time.setText(storage.get("swipe_time"));


//字符串转换为二维数组
function convert_string(string_array){
    var two_dimensional = string_array.split('\n');
    var two_text;
    for(i = 0; i < two_dimensional.length; i++){
        two_text = two_dimensional[i].split(',');
        two_dimensional[i] = new Array();
        two_dimensional[i][0] = two_text[0];
        two_dimensional[i][1] = two_text[1];
    }
    return two_dimensional;
}
//依次显示
function add_display(content) {
    content_add = content_add + '\n' + content;
    ui.output.setText(content_add);    
}
//解锁屏幕
function unlock_screen(pwd_array, count, time){
    device.wakeUp();sleep(1000);
    while(count--){swipe(device.width/2, device.height*0.8, device.width/2, device.height*0.2, time);sleep(1000);}
    sleep(3000);
    if(pwd_array.length == 1) exit();
    else {
        for(i = 0; i < pwd_array.length; i++){click(Number(pwd_array[i][0]),Number(pwd_array[i][1]));sleep(1000);}
    }
}

//息屏验证
threads.start(function(){
    if(!device.isScreenOn()) {unlock_screen(convert_string(storage.get("save_origin")), storage.get("swipe_count"), storage.get("swipe_time"));exit();}
});
