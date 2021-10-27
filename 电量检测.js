'ui';
var write_content = '';

threads.start(function(){
    var w = floaty.rawWindow(<text text='运行中...' textSize="16sp" textColor="#f44336"/>);
    w.setTouchable(false);
    setTimeout(()=>{w.close();}, 172800000);
});

ui.layout(
    <scroll>
    <vertical padding="16">
        <text textSize="16sp" textColor="blue" text="提示："/>
        <text textSize="16sp" textColor="blue" text="1.需要授予读取系统的权限"/>
        <text textSize="16sp" textColor="blue" text="2.结果将保存在手机存储的根目录的txt文本中"/>

        <horizontal>
          <text textSize="16sp" textColor="red" text="每隔"/>
          <input id="loop_second" inputType="number" textSize="16sp"/>
          <text textSize="16sp" textColor="red" text="秒，采集一次电量"/>
        </horizontal>
  
        <horizontal>
          <text textSize="16sp" textColor="red" text="每隔"/>
          <input id="loop_min" inputType="number" textSize="16sp"/>
          <text textSize="16sp" textColor="red" text="分钟，保存一次数据"/>
        </horizontal>

        <button id='save' text="保存预设" textSize="20sp"/>
        <button id='start' text="开始运行" textSize="20sp"/>
    </vertical>
    </scroll>
)

ui.start.click(function(){
    let startDate = new Date ();
    var current_time = startDate.getMonth()+1+'-'+startDate.getDate()+' '+startDate.getHours()+':'+startDate.getMinutes();
    var loop_second = Number(ui.loop_second.text());
    var loop1_times = Number(ui.loop_min.text())*60 / loop_second;
    var object1;
    home();
    threads.start(function(){     
      files.createWithDirs("/sdcard/JS_电量监测/"+current_time+".txt");
      sleep(500);
      for(;;){
        object1 = open("/sdcard/JS_电量监测/"+current_time+".txt", "a");
        object1.write(write_content);
        sleep(500);
        write_content = '';
        object1.close();
        for(i = 0; i < loop1_times; i++){
          sleep(loop_second*1000);
          write_content += device.getBattery()+'%\n';
        }
      }
    });
});

ui.save.click(function(){
    let loop_second = ui.loop_second.text();
    let loop_min = ui.loop_min.text();
    storage.put('loop_second', loop_second); 
    storage.put('loop_min', loop_min);   
    toast('保存成功');
});
//读取配置
var storage = storages.create("67battery");
if(storage.get("loop_second")) ui.loop_second.setText(storage.get("loop_second"));
if(storage.get("loop_min")) ui.loop_min.setText(storage.get("loop_min"));
