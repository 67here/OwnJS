const{slt, txt_trans, cbox, txt_define} = hamibot.env

if(!cbox){
	toastLog('执行预设遮罩');
  let trans_number = Number(txt_trans);
  trans_number = parseInt(255 * ( 1 - trans_number/100));
  let transparency = trans_number.toString(16);
  log(slt)
  if(slt == 'yellow') eval(yellowCode(transparency))
  else if(slt == 'black') eval(blackCode(transparency))
  else eval(brownCode(transparency));
}
else {
	toastLog('执行自定义遮罩');
	eval(codeEditor(txt_define))
}

w.setSize(-1, -1); w.setTouchable(false);
setTimeout(()=>{ w.close();}, 36000000);

//功能函数
function yellowCode(transparent){
  let part_head = "var w = floaty.rawWindow(<frame gravity='center' bg='#";
  let part_middle = transparent;
  let part_end = "ffcc00'/>)";
  let code = part_head + part_middle + part_end;
  return code;
}

function brownCode(transparent){
  let part_head = "var w = floaty.rawWindow(<frame gravity='center' bg='#";
  let part_middle = transparent;
  let part_end = "808080'/>)";
  let code = part_head + part_middle + part_end;
  return code;
}

function blackCode(transparent){
  let part_head = "var w = floaty.rawWindow(<frame gravity='center' bg='#";
  let part_middle = transparent;
  let part_end = "000000'/>)";
  let code = part_head + part_middle + part_end;
  return code;
}

function codeEditor(define_code){
  let part_head = "var w = floaty.rawWindow(<frame gravity='center' bg='";
  let part_middle = define_code;
  let part_end = "'/>)";
  let code = part_head + part_middle + part_end;
  return code;
}
