/*
銘柄コードから株探のページをスクレイピングしシートに表示するカスタム関数
サンプル：https://docs.google.com/spreadsheets/d/1ahRrazuPceI1MMr2cofO1boBRjV1r8oFT4fWsT-ZKus/edit#gid=519280427
———————————–*/
function getFinance(code) {

  let reg, match;
  let B, D1, D2, D3, D4, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, AA, AB;
  let data = [];

  //株探にアクセスし、指定銘柄コードのページを取得
  const response = UrlFetchApp.fetch('https://kabutan.jp/stock/?code=' + code);
  const content = response.getContentText();

  //マーケット
  reg = /<span class="market">([\s\S]*?)<\/span>/g;
  match = content.match(reg);
  if (match == null) {//上場廃止の場合
    return;
  }
  B = reg.exec(match[0])[1];

  //企業名
  reg = /<h2><span>会社情報<\/span><\/h2>([\s\S]*?)<\/h3>/g;
  match = content.match(reg);
  D1 = reg.exec(match[0])[1].replace('<h3>', '').replace(/\s+/g, '');

  //企業URL
  reg = /<th scope='row'>会社サイト<\/th>([\s\S]*?)" target="_blank">/g;
  match = content.match(reg);
  D2 = reg.exec(match[0])[1].replace('<td><a href="', '').replace(/\s+/g, '');

  //企業概要
  reg = /<th scope='row'>概要<\/th>([\s\S]*?)<\/td>/g;
  match = content.match(reg);
  D3 = reg.exec(match[0])[1].replace('<td>', '').replace(/\s+/g, '');

  //企業業種
  reg = /<th scope='row'>業種<\/th>([\s\S]*?)<\/td>/g;
  match = content.match(reg);
  D4 = reg.exec(match[0])[1].replace('<td>', '').replace(/\s+/g, '');

  //株価
  reg = /<span class="kabuka">([\s\S]*?)円<\/span>/g;
  match = content.match(reg);
  if (match == null) {
    E = '－';
  } else {
    E = reg.exec(match[0])[1].replace(/\s+/g, '');
  }

  //前日比1
  reg = /<dd><span class="(down|up)">([\s\S]*?)<\/span>/g;
  match = content.match(reg);
  if (match == null) {
    F = '－';
    G = '－';
  } else {
    F = reg.exec(match[0])[2].replace(/\s+/g, '');
    //前日比2
    match = content.match(reg);
    G = reg.exec(match[1])[2].replace(/\s+/g, '');
  }

  //業績アイコンURL
  reg = /<dt>業績<\/dt>([\s\S]*?)" title="今期予想"/g;
  match = content.match(reg);
  if (match == null) {
    H = '－';
  } else {
    H = 'https://kabutan.jp/' + reg.exec(match[0])[1].replace('<dd><img src="', '').replace(/\s+/g, '');
  }
  //単元株数
  reg = /<dt>単位<\/dt>([\s\S]*?)株 <\/dd>/g;
  match = content.match(reg);
  I = reg.exec(match[0])[1].replace('<dd>', '').replace(/\s+/g, '');

  //PER
  reg = /<td>[+-]?([0-9]+(\.[0-9]*)?|\.[0-9]+)([eE][+-]?[0-9]+)?<span class="fs9">倍/g;
  match = content.match(reg);
  J = reg.exec(match[0])[1].replace(/\s+/g, '');

  //PBR
  match = content.match(reg);
  K = reg.exec(match[1])[1].replace(/\s+/g, '');

  //前日終値
  reg = /<dt>前日終値<\/dt>([\s\S]*?)&nbsp;/g;
  match = content.match(reg);
  L = reg.exec(match[0])[1].replace('<dd class="floatr">', '').replace(/\s+/g, '');

  //始値
  reg = /<th scope='row'>始値<\/th>([\s\S]*?)<\/td>/g;
  match = content.match(reg);
  M = reg.exec(match[0])[1].replace('<td>', '').replace(/\s+/g, '');

  //高値
  reg = /<th scope='row'>高値<\/th>([\s\S]*?)<\/td>/g;
  match = content.match(reg);
  N = reg.exec(match[0])[1].replace('<td>', '').replace(/\s+/g, '');

  //安値
  reg = /<th scope='row'>安値<\/th>([\s\S]*?)<\/td>/g;
  match = content.match(reg);
  O = reg.exec(match[0])[1].replace('<td>', '').replace(/\s+/g, '');

  //出来高
  reg = /<th scope='row'>出来高<\/th>([\s\S]*?)&nbsp/g;
  match = content.match(reg);
  P = reg.exec(match[0])[1].replace('<td>', '').replace(/\s+/g, '');

  //売買代金
  reg = /<th scope='row'>売買代金<\/th>([\s\S]*?)&nbsp/g;
  match = content.match(reg);
  Q = reg.exec(match[0])[1].replace('<td>', '').replace(/\s+/g, '');

  //約定回数
  reg = /<th scope='row'>約定回数<\/th>([\s\S]*?)&nbsp/g;
  match = content.match(reg);
  R = reg.exec(match[0])[1].replace('<td>', '').replace(/\s+/g, '');

  //売買最低代金
  reg = /<th scope='row'>売買最低代金<\/th>([\s\S]*?)&nbsp/g;
  match = content.match(reg);
  S = reg.exec(match[0])[1].replace('<td>', '').replace(/\s+/g, '');

  //時価総額
  reg = /<th scope='row'>時価総額<\/th>([\s\S]*?)<\/td>/g;
  match = content.match(reg);
  T = reg.exec(match[0])[1].replace('<td>', '').replace(/<span>/g, '').replace(/<\/span>/g, '').replace(/\s+/g, '');

  //株価トレンドアイコンURL
  reg = /<td><img src="\/images\/stock\/([\s\S]*?)" alt="/g;
  match = content.match(reg);
  if (match == null) {
    U = '－';
    W = '－';
    Y = '－';
    AA = '－';
  } else {
    U = 'https://kabutan.jp/images/stock/' + reg.exec(match[0])[1].replace(/\s+/g, '');
    match = content.match(reg);
    W = 'https://kabutan.jp/images/stock/' + reg.exec(match[1])[1].replace(/\s+/g, '');
    match = content.match(reg);
    Y = 'https://kabutan.jp/images/stock/' + reg.exec(match[2])[1].replace(/\s+/g, '');
    match = content.match(reg);
    AA = 'https://kabutan.jp/images/stock/' + reg.exec(match[3])[1].replace(/\s+/g, '');
  }

  //株価トレンド(かい離率)
  reg = /<td><span class="(down|up)">[+-]?([0-9]+(\.[0-9]*)?|\.[0-9]+)([eE][+-]?[0-9]+)?<\/span>％<\/td>/g;
  match = content.match(reg);
  if (match == null) {
    V = '－';
    X = '－';
    Z = '－';
    AB = '－';
  } else if (match.length == 2) {
    V = "0.00";
    X = "0.00";
    if (match[0].match(/up/)) {
      Z = "+" + reg.exec(match[0])[2].replace(/\s+/g, '');
    } else {
      Z = "-" + reg.exec(match[0])[2].replace(/\s+/g, '');
    }
    match = content.match(reg);
    if (match[1].match(/up/)) {
      AB = "+" + reg.exec(match[1])[2].replace(/\s+/g, '');
    } else {
      AB = "-" + reg.exec(match[1])[2].replace(/\s+/g, '');
    }
  } else if (match.length == 3) {
    V = "0.00";
    if (match[0].match(/up/)) {
      X = "+" + reg.exec(match[0])[2].replace(/\s+/g, '');
    } else {
      X = "-" + reg.exec(match[0])[2].replace(/\s+/g, '');
    }
    match = content.match(reg);
    if (match[1].match(/up/)) {
      Z = "+" + reg.exec(match[1])[2].replace(/\s+/g, '');
    } else {
      Z = "-" + reg.exec(match[1])[2].replace(/\s+/g, '');
    }
    match = content.match(reg);
    if (match[2].match(/up/)) {
      AB = "+" + reg.exec(match[2])[2].replace(/\s+/g, '');
    } else {
      AB = "-" + reg.exec(match[2])[2].replace(/\s+/g, '');
    }
  } else {
    if (match[0].match(/up/)) {
      V = "+" + reg.exec(match[0])[2].replace(/\s+/g, '');
    } else {
      V = "-" + reg.exec(match[0])[2].replace(/\s+/g, '');
    }
    match = content.match(reg);
    if (match[1].match(/up/)) {
      X = "+" + reg.exec(match[1])[2].replace(/\s+/g, '');
    } else {
      X = "-" + reg.exec(match[1])[2].replace(/\s+/g, '');
    }
    match = content.match(reg);
    if (match[2].match(/up/)) {
      Z = "+" + reg.exec(match[2])[2].replace(/\s+/g, '');
    } else {
      Z = "-" + reg.exec(match[2])[2].replace(/\s+/g, '');
    }
    match = content.match(reg);
    if (match[3].match(/up/)) {
      AB = "+" + reg.exec(match[3])[2].replace(/\s+/g, '');
    } else {
      AB = "-" + reg.exec(match[3])[2].replace(/\s+/g, '');
    }
  }

  //配列で返す
  const combine = [B, D1, D2, D3, D4, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, AA, AB];
  data.push(combine);
  return data;
}