/* c8 ignore start */
import { fastify } from "fastify";
import fastifyWs from "fastify-websocket";
import fs from "fs-extra";
import { resolve } from "path";
import fastifyHttpProxy from "fastify-http-proxy";
import fastifyStatic from "fastify-static";
import fastifyCompress from "fastify-compress";
import type { Conf } from "./getConfig";
import { createHmac } from "crypto";

const cwd = process.cwd();

const wsList = new Set<WebSocket>();
export const serve = (conf: Conf) => {
  if (!conf.watch) {
    return;
  }
  const htmlPath = resolve(conf.out!, "index.html");

  const { gzip, host, port, proxy } = conf;

  const publicPrefix = conf["path-prefix"];

  const app = fastify();

  if (proxy) {
    proxy.forEach((p) => {
      const [prefix, other] = (p as string).split("|");
      const opt = {
        prefix,
        upstream: other,
        rewritePrefix: prefix,
        http2: false,
      };
      app.register(fastifyHttpProxy, opt);
    });
  }

  if (gzip) {
    app.register(fastifyCompress, { global: true });
  }

  app.register(fastifyStatic, {
    root: resolve(cwd, conf.out!),
    prefix: publicPrefix,
  });
  app.register(fastifyWs);

  app.get("/", function (req, rep) {
    var html = fs.readFileSync(htmlPath, "utf8");
    html = html.replace("</html>", "");
    html += `<script>${devHot}</script></html>`;
    rep.code(200).header("Content-Type", "text/html; charset=utf-8").send(html);
  });

  app.get("/devhot", { websocket: true }, (connection) => {
    connection.socket.on("message", (msg: string) => {
      if (msg === "reload") {
        wsList.add(connection.socket);
      }
    });
  });

  app.listen(port, host, () => {
    console.log(`listen: http://${host}:${port}`);
  });
};

export const releaseBrowser = (conf: Conf) => {
  const indexJS = fs.readFileSync(resolve(conf.out!, "index.js"));
  const key = createHmac("sha256", "bike")
    .update(indexJS)
    .digest("hex")
    .slice(5, 13);

  fs.renameSync(
    resolve(conf.out!, "index.js"),
    resolve(conf.out!, `index-${key}.js`)
  );

  const _html = conf["html-text"].replace(
    "/index.js?bike=1",
    `"/index-${key}.js"`
  );

  fs.writeFileSync(resolve(conf.out!, "index.html"), _html);
};

let keep: any = null;
export const onBuilded = (conf: Conf) => {
  if (keep) {
    clearTimeout(keep);
    keep = null;
  }
  keep = setTimeout(() => {
    // bs.reload();
    wsList.forEach((ws) => {
      if (ws.readyState != 1) {
        wsList.delete(ws);
        return;
      }
      try {
        ws.send("reload");
      } catch (err) {
        console.error(err);
        wsList.delete(ws);
      }
    });
  }, 66);
};

const devHot = `(function () {
  window.devHot = true;
  let ws = new WebSocket("ws://" + location.host + "/devhot");
  ws.onmessage = (env) => {
    if (env.data === "reload") {
      window.location.reload();
    }
  };
  ws.onopen = () => {
    if (ws.readyState > 0) {
      console.log("[bike-hot] start");
      ws.send("reload");
    }
  };
  ws.onclose = () => {
    console.log("[bike-hot] closed");
    reStart();
  };
  ws.onerror = () => {
    console.log("[bike-hot] error");
    reStart();
  };

  let checker;
  const reStart = () => {
    console.log("[bike-hot] reconnect");
    if (checker) {
      checker.close();
    }
    checker = null;
    checker = new WebSocket("ws://" + location.host + "/devhot");
    checker.onopen = () => {
      if (checker.readyState > 0) {
        window.location.reload();
      }
    };
    setTimeout(reStart, 2000);
  };
})();`;
