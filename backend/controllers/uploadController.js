import cloudinary from "../config/cloudinary.js";

// Pure Node.js Stream without external packages
const streamUpload = (fileBuffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(fileBuffer);
  });
};

// Upload Image (Course Thumbnail, Mentor Photo, etc.)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const folder = req.body.folder || "knowway_images";
    const result = await streamUpload(req.file.buffer, {
      folder: folder,
      resource_type: "image",
    });

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully to Cloudinary!",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error("Cloudinary Image Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image to Cloudinary",
    });
  }
};

// Upload Video (Lectures, Previews)
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file provided",
      });
    }

    const folder = req.body.folder || "knowway_courses/lectures";
    const result = await streamUpload(req.file.buffer, {
      folder: folder,
      resource_type: "video",
      chunk_size: 6000000, // 6MB chunks
    });

    // Format duration in readable minutes/seconds (e.g. 8m 30s or 15m)
    let formattedDuration = "5m";
    if (result.duration) {
      const mins = Math.floor(result.duration / 60);
      const secs = Math.round(result.duration % 60);
      if (mins > 0 && secs > 0) {
        formattedDuration = `${mins}m ${secs}s`;
      } else if (mins > 0) {
        formattedDuration = `${mins}m`;
      } else {
        formattedDuration = `${secs}s`;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Video uploaded successfully to Cloudinary!",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        duration: formattedDuration,
        duration_seconds: result.duration,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error("Cloudinary Video Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload video to Cloudinary",
    });
  }
};
