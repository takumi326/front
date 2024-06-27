import applyCaseMiddleware from "axios-case-converter";
import axios from "axios";

// applyCaseMiddleware:
// axiosで受け取ったレスポンスの値をスネークケース→キャメルケースに変換
// または送信するリクエストの値をキャメルケース→スネークケースに変換してくれるライブラリ

// ヘッダーに関してはケバブケースのままで良いので適用を無視するオプションを追加
const options = {
  ignoreHeaders: true,
};

export const client = applyCaseMiddleware(
  axios.create({
    baseURL: "https://back-red-leaf-1146.fly.dev/api/v1",
  }),
  options
);

// "http://localhost:3000/api/v1"
// "https://back-red-leaf-1146.fly.dev/api/v1"
