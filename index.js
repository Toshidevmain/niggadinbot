const { spawn } = require("child_process");
const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 8080;

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

let botProcess = null;

const manageBotProcess = (script) => {
    if (botProcess) {
        botProcess.kill();
        console.log(`Terminated previous instance of ${script}.`);
    }

    botProcess = spawn("node", ["--trace-warnings", "--async-stack-traces", script], {
        cwd: __dirname,
        shell: true
    });

    botProcess.stdout.on("data", (data) => {
        const message = data.toString();
        console.log(message);
        io.emit("log", message);
    });

    botProcess.stderr.on("data", (data) => {
        const message = data.toString();
        console.error(message);
        io.emit("log", message);
    });

    botProcess.on("close", (exitCode) => {
        const message = `${script} terminated with code: ${exitCode}`;
        console.log(message);
        io.emit("log", message);
    });

    botProcess.on("error", (error) => {
        const message = `Error while starting ${script}: ${error.message}`;
        console.error(message);
        io.emit("log", message);
    });
};

manageBotProcess("core/main.js");

server.listen(port, "0.0.0.0", () => {
    console.log(`Telegram Bot server is running on port ${port}`);
});
