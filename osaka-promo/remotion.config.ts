import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setCrf(16);
// Render with the locally installed Chrome instead of downloading a headless shell.
Config.setBrowserExecutable("C:/Program Files/Google/Chrome/Application/chrome.exe");
