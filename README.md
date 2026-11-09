# Lemon 英単語

英検2級レベルの英単語（1354語・独自選定）を4択で覚えるアプリです。
復習のタイミングは FSRS で単語ごとに計算します。

## GitHub Pages に置く

1. リポジトリのいちばん上（ルート）に、このフォルダの中身をそのまま全部置きます。
   フォルダごと置くと、URLの最後にフォルダ名が付くので注意してください。
   - index.html / fsrs.js / words-eiken2.js / manifest.webmanifest / sw.js
   - icon-192.png / icon-512.png / icon-maskable-512.png
2. Settings → Pages → Branch を `main`、フォルダを `/ (root)` にして Save。
3. 1〜2分待ってから `https://ユーザー名.github.io/リポジトリ名/` を Android の Chrome で開きます。
4. ホーム画面の「入れる」、またはChromeのメニュー →「アプリをインストール」。

## アプリにならないとき

アプリの「マイページ」→「アプリとして使う」に、止まっている所が × で出ます。
よくある原因：
- github.com のリポジトリのページを開いている（github.io の方を開く）
- LINE などのアプリ内ブラウザで開いている
- アイコン画像や sw.js がアップロードされていない
- 古い版が残っている（Chromeでページを再読み込み）

## 更新するとき

ファイルを上書きしたら、sw.js の `CACHE = "lemon-v2.0"` の数字も上げてください。
