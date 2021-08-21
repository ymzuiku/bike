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
let reloadLog = () => {};

const wsList = new Set<WebSocket>();
export const devServe = (conf: Conf) => {
  if (!conf.watch) {
    return;
  }
  const htmlPath = resolve(conf["html-out"]!, "index.html");

  const { gzip, host, port, proxy } = conf;

  const publicPrefix = conf["path-prefix"];

  const app = fastify();

  if (proxy) {
    proxy.forEach((p) => {
      const [prefix, other] = (p as string).split("::");
      const opt = {
        prefix,
        upstream: other + prefix,
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
    root: resolve(cwd, conf["html-out"]!),
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
    reloadLog = () => {
      console.log(`Client dev server listen: http://${host}:${port}`);
    };
  });
};

export const releaseBrowser = (conf: Conf) => {
  const urlPrefix = conf["url-prefix"];

  fs.readdirSync(conf["html-out"]!).forEach((file) => {
    if (file !== "index.css" && /\.(css)/.test(file)) {
      fs.remove(resolve(conf["html-out"]!, file));
    }
  });

  let cssKey = "";
  if (fs.existsSync(resolve(conf["html-out"]!, "index.css"))) {
    const indexCss = fs.readFileSync(resolve(conf["html-out"]!, "index.css"));
    cssKey = createHmac("sha256", "bike")
      .update(indexCss)
      .digest("hex")
      .slice(5, 13);

    fs.renameSync(
      resolve(conf["html-out"]!, "index.css"),
      resolve(conf["html-out"]!, `index-${cssKey}.css`)
    );
  }

  const indexJS = fs.readFileSync(resolve(conf["html-out"]!, "index.js"));
  const key = createHmac("sha256", "bike")
    .update(indexJS)
    .digest("hex")
    .slice(5, 13);

  fs.renameSync(
    resolve(conf["html-out"]!, "index.js"),
    resolve(conf["html-out"]!, `index-${key}.js`)
  );

  const _html = replaceCss(conf, `index-${cssKey}.css`).replace(
    "/index.js?bike=1",
    `${urlPrefix}index-${key}.js`
  );

  fs.writeFileSync(resolve(conf["html-out"]!, "index.html"), _html);
};

let keep: any = null;
export const onBuilded = (conf: Conf) => {
  if (keep) {
    clearTimeout(keep);
    keep = null;
  }

  replaceCss(conf, "index.css");
  reloadLog();
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

function replaceCss(conf: Conf, name: string) {
  const urlPrefix = conf["url-prefix"];
  const css = `<link rel="stylesheet" href="${urlPrefix}${name}" />\n`;
  // fs.readdirSync(conf["html-out"]!).forEach((file) => {
  //   if (/\.(css)/.test(file)) {
  //     css += `<link rel="stylesheet" href="${urlPrefix}${file}" />\n`;
  //   }
  // });
  const _html = conf["html-text"].replace("</head>", css + "</head/>");
  fs.writeFileSync(resolve(conf["html-out"]!, "index.html"), _html);
  return _html;
}

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
