// 必要なモジュールをインポート
import net from 'net';
import { exec } from 'child_process';

const PORT = 25565;
// サーバーを作成
const server = net.createServer((socket) => {
  console.log('Client connected.');

  // クライアントからのデータを受け取るイベントリスナー
  socket.on('data', () => {
    // サーバーを停止
    socket.end()
    server.close(() => {
      // バッチファイルを実行
      exec('path/to/your/batchfile.bat');
    });
  });
});

// サーバーを指定したポートでリッスン
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});