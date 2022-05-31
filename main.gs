function setTrigger(){
  // let funcName = 'setTrigger';
  // deleteTrigger(funcName);
  // createTrigger(funcName);
  duplicateDocument();

  // record log.
  recordLog(arguments.callee.name);
}

function createTrigger(funcName){
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(16); // 日本の時間より14時間早く設定する。6時に作る。
  date.setMinutes(1);
  ScriptApp.newTrigger(funcName).timeBased().at(date).create();
}

function deleteTrigger(funcName){
  const triggers = ScriptApp.getProjectTriggers();
  for(let trigger of triggers){
    if(trigger.getHandlerFunction() == funcName){
      ScriptApp.deleteTrigger(trigger);
    }
  }
}

function createDocument() {
  let today = new Date();
  today = Utilities.formatDate(today,"JST", "yyyyMMdd(E)");
  let fileTitle = today;

  //【手順1】：新規ドキュメントをマイドライブに作成する
  let docFile = DocumentApp.create(fileTitle);
  //【手順2】：【手順1】で作成したスプレッドシートをFileオブジェクトとして取得する */
  const fileId = DriveApp.getFileById(docFile.getId());
  //【手順3】：手順1で作成したドキュメントを指定フォルダに「追加」する（コピーではない）
  const folderId = OUTPUT_FOLDER_ID; //フォルダID（「Diary」）
  DriveApp.getFolderById(folderId).addFile(fileId);
  //【手順4】：作成したドキュメントをマイドライブから「削除」する
  DriveApp.getRootFolder().removeFile(fileId);

  // ドキュメントを編集する。
  let body_docFile = docFile.getBody();
  // ドキュメントのページ設定。
  const margin_mm    = 13;
  const dpi          = 72;
  const unit_pixel   = 25.4;
  let margin_pixel = margin_mm * dpi / unit_pixel;
  body_docFile.setMarginTop(margin_pixel);
  body_docFile.setMarginBottom(margin_pixel);
  body_docFile.setMarginLeft(margin_pixel);
  body_docFile.setMarginRight(margin_pixel);
  // ドキュメントの内容を編集する。
  for(let i = 0; i <= 2; i++) {
    // 本体にタイトルを追加する
    let paragraph = body_docFile.appendParagraph('[未編集]');
    paragraph.editAsText().setFontSize('13');
    paragraph.editAsText().setBold(true);
    // パラグラフに内容を追加する
    let text = paragraph.appendText('\n');
    text.editAsText().setFontSize('10');
    text.editAsText().setBold(false);
  }
}

function duplicateDocument() {
  // テンプレートファイル（「yyyyMMdd(E)」）
  let templateFile = DriveApp.getFileById(TEMPLATE_FILE_ID);
  // 出力フォルダ（「010_Diary」）
  let outputFolder = DriveApp.getFolderById(OUTPUT_FOLDER_ID_BY_DUPLICATION);
  // 出力ファイル名
  let outputFileName = Utilities.formatDate(new Date(), 'JST', 'yyyyMMdd(E)');
  
  templateFile.makeCopy(outputFileName, outputFolder);
}

function recordLog(argumentName) {
  let scriptId = ScriptApp.getScriptId();
  let passingJson = {
    'batchUrl': 'https://script.google.com/home/projects/' + scriptId,
    'methodName': argumentName
  }
  let options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(passingJson)
  };
  // let response = UrlFetchApp.fetch(LOG_GETTING_SHEET_URL, options);
  // console.log(response.getResponseCode());
}

function main(){
  setTrigger();
}

