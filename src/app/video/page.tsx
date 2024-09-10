'use client';

import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player/file'), { ssr: false });

const VideoPage = () => {
  return (
    <div>
      <h1>Video</h1>

      <ReactPlayer
        // url="http://localhost:8080/CGhyvenulW6vyVYEMAeJOegoI2q5sn/hls/groupKey/ona26Q0x9B8081/s.m3u8"
        url="http://localhost:3334/hls/index.m3u8"
        playing
        loop
        controls
        muted
        width="500px"
        height="500px"
        onError={(error) => console.log('ERROR: ', error)}
      />

      <video id="video-player" controls preload="none">
        <source
          src="http://localhost:3334/hls/index.m3u8"
          type="application/x-mpegURL"
        />
      </video>
    </div>
  );
};

export default VideoPage;
