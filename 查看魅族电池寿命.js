"ui";
auto.waitFor();

var content_add = '';

function main() {   
    //1.找寻文件
    var file_exits = files.isDir('/sdcard/mbattery_charger/');
    if(file_exits) {
      var file_name = files.listDir('/sdcard/mbattery_charger/');
    	add_display('成功！读取充电信息:'+file_name[0]+'\n');
    	//2.读取、检索、收集
    	var targer_file = open('/sdcard/mbattery_charger/'+file_name[0]);
    	var file_content_line = targer_file.readlines();
    	var target_lines = new Array();
    	var lines = 0;
      for(i = 0; i < file_content_line.length; i++){
          let index = file_content_line[i].indexOf("battery_capacity");
          if(index != -1) {
              let now_lines = file_content_line[i].slice(index,-1);
              target_lines[lines++] = now_lines;
          }
      }
      add_display('前者是有效容量，请自行计算');
      for(i = 0; i < target_lines.length; i++){
      add_display('');    
      add_display(target_lines[i]);
      }
    }
  		else add_display('未发现充电日志');
}

function add_display(content) {
    content_add = content_add + '\n' + content;
    ui.myText.setText(content_add);    
}

ui.layout(
    <vertical padding="16">
        <text textSize="16sp" textColor="blue" text="提示"/>
        <text textSize="16sp" textColor="blue" text="1.当前支持系统Flyme"/>
        <button id='start' text="开始运行" textSize="20sp"/>
        <text textSize="16sp" textColor="black" text="输出框"/>
        <text id="myText"></text>
    </vertical>
);
//指定确定按钮点击时要执行的动作
//频道
ui.start.click(function(){
    main();
});
