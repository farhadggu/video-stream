import { NextResponse } from "next/server";
const fs = require("fs").promises;
const { exec } = require("child_process");

export async function POST(request: any, response: any) {
  try {
    const formData = await request.formData();
    const bytes = await formData.get("file").arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile("video.mp4", buffer);

    const originalname = await formData.get("name");
    const folderName = `./files/videos/${originalname}`;

    try {
      await fs.access(folderName);
      console.log("Folder already exists");
      return NextResponse.json({ error: "Folder already exists" }, { status: 500 });
    } catch (err) {
      // If directory doesn't exist, create it
      await fs.mkdir(folderName);
      await copyFileAsync("playlist.m3u8", `${folderName}/playlist.m3u8`);
      await execFFmpeg(folderName);
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function copyFileAsync(source: any, destination: any) {
  try {
    await fs.copyFile(source, destination);
    console.log(`${source} was copied`);
  } catch (err) {
    console.error(err);
    throw new Error(`Error copying ${source}`);
  }
}

async function execFFmpeg(folderName: any) {
  const resolutions = [
    { resolution: "144p", bitrate: "250k" },
    { resolution: "240p", bitrate: "500k" },
    { resolution: "360p", bitrate: "800k" },
    { resolution: "480p", bitrate: "1400k" },
    { resolution: "720p", bitrate: "2800k" },
    { resolution: "1080p", bitrate: "5000k" },
  ];

  for (const { resolution, bitrate } of resolutions) {
    const command = `ffmpeg -hide_banner -y -i video.mp4 -vf scale=w=${getResolutionWidth(
      resolution
    )}:h=${getResolutionHeight(
      resolution
    )}:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v ${bitrate} -maxrate ${getMaxRate(
      bitrate
    )} -bufsize ${getBufferSize(
      bitrate
    )} -b:a 96k -hls_segment_filename ${folderName}/${resolution}_%03d.ts ${folderName}/${resolution}.m3u8`;

    await executeCommand(command, bitrate);
  }
}

function getResolutionWidth(resolution: any) {
  const resolutions: { [key: string]: number } = {
    "144p": 256,
    "240p": 426,
    "360p": 640,
    "480p": 842,
    "720p": 1280,
    "1080p": 1920,
  };
  return resolutions[resolution];
}

function getResolutionHeight(resolution: any) {
  const aspectRatio = 9 / 16; // 16:9 aspect ratio
  return Math.round(getResolutionWidth(resolution) * aspectRatio);
}

function getMaxRate(bitrate: any) {
  return parseInt(bitrate) * 1.1;
}

function getBufferSize(bitrate: any) {
  return parseInt(bitrate) * 1.5;
}

function executeCommand(command: any, bitrate: any) {
  return new Promise<void>((resolve, reject) => {
    exec(command, (err: any, output: any) => {
      if (err) {
        console.error("could not execute command: ", err);
        reject(new Error("Internal Server Error"));
      } else {
        console.log(`FFmpeg command executed successfully ${bitrate}`);
        resolve();
      }
    });
  });
}
