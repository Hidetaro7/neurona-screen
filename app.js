// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START appengine_websockets_app]
const app = require('express')();
app.set('view engine', 'pug');

const server = require('http').Server(app);
const io = require('socket.io')(server);

const featuredMessage = {
  id: null,
  lastUpdate: 0
}
const limitTime = 10000; //10秒おきに中心になるメッセージを入れ替える

app.get('/', (req, res) => {
  res.render('index.pug');
});
app.get('/viewer', (req, res) => {
  res.render('viewer.pug');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    const sendMessage = {centerd: false, message: msg.message}
    //console.log(new Date().getTime() , featuredMessage.lastUpdate ,new Date().getTime() - featuredMessage.lastUpdate )
    if(!featuredMessage.id || new Date().getTime() - featuredMessage.lastUpdate > limitTime) {
      featuredMessage.id = msg.id;
      sendMessage.centerd = true
      featuredMessage.lastUpdate = new Date().getTime()
    }
    io.emit('chat message', sendMessage);
  });
  socket.on('good emitted', (msg) => {
    io.emit('good emitted', msg);
  });
});

if (module === require.main) {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
}
// [END appengine_websockets_app]

// ここからテスト
const testEmit = () => {
  const texts = [
    "みんなは場合どうかこの把持っ放しというののために這入り",
    "話しいうませあっので",
    "ですのはまして","事実を同時に","ですましませ。","何とも嘉納さんで","存在性質まだ説明","を知らでし世間その国","家私か攻撃のという","ごまごま","ごありなんたと、","同じほかはあれか","原因男が思いが、","岡田君のものに","香の私","がせっかく","お相違というて","誰個人","に実焦燥の","得ように","どうもご周旋が","見えるですでて","たといなおお出かけに","閉じうてみたのに考えますで。","しかしまたご必竟が","押しのはどう","自由と明らめたて、","その足のは","読むでしょけ","れどもという","個性にして","来たらたい。"
  ];
  setInterval(() => {
    if(Math.random() < .6) {
      io.emit('chat message', {id: 0, message:texts[Math.floor(Math.random() * texts.length)]});
    }
  },500)
}
testEmit()
// ここまでテスト

module.exports = server
