import axios from 'axios';

export const uploadToVimeo = async (file) => {
  console.log("Uploading to Vimeo...");
  try {
    const createVideoRes = await axios({
      method: 'POST',
      url: 'https://api.vimeo.com/me/videos',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_VIMEO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
      },
      data: {
        upload: {
          approach: 'tus',
          size: file.size,
        },
      },
    });

    const uploadLink = createVideoRes.data.upload.upload_link;
    await axios({
      method: 'PATCH',
      url: uploadLink,
      headers: {
        'Tus-Resumable': '1.0.0',
        'Upload-Offset': 0,
        'Content-Type': 'application/offset+octet-stream',
      },
      data: file,
    });

    // Get the video link after upload
    const videoURL = createVideoRes.data.link;
    console.log('Video uploaded to Vimeo:', videoURL);
    return videoURL;
  } catch (error) {
    console.error('Error uploading video to Vimeo:', error);
    throw new Error('Vimeo upload failed');
  }
};


