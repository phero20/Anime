import axios from "axios";
import AnimeData from "../models/AnimeData.js";
import StreamLink from "../models/StreamLink.js";
import Episode from "../models/EpisodeModel.js";
import User from "../models/authModel.js";

const backendUrl = process.env.BACKEND_URL;
const proxyBaseUrl = process.env.SELF_URL || "http://localhost:6789";


export const fetchHomeData = async (req, res) => {
  try {
    const response = await axios.get(backendUrl + "/api/v2/hianime/home");
    return res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const fetchCategoryData = async (req, res) => {
  try {
    const name = req.params.name;
    const page = req.params.page;
    const response = await axios.get(
      backendUrl + `/api/v2/hianime/category/${name}?page=${page}`
    );
    return res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const fetchGenreData = async (req, res) => {
  try {
    const name = req.params.name;
    const page = req.params.page;
    const response = await axios.get(
      backendUrl + `/api/v2/hianime/genre/${name}?page=${page}`
    );
    return res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const fetchAnimeData = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(
      backendUrl + `/api/v2/hianime/anime/${id}`
    );
    return res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const fetchProducerData = async (req, res) => {
  try {
    const name = req.params.name;
    const page = req.params.page;
    const response = await axios.get(
      backendUrl + `/api/v2/hianime/producer/${name}?page=${page}`
    );
    return res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const fetchEpisodesData = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(
      backendUrl + `/api/v2/hianime/anime/${id}/episodes`
    );
    return res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const fetchEpisodesServerData = async (req, res) => {
  try {
    const episodeId = req.body.episodeId;
    const response = await axios.get(
      backendUrl + `/api/v2/hianime/episode/servers?animeEpisodeId=${episodeId}`
    );
    return res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const fetchSearchSuggestions = async (req, res) => {
  try {
    const q = req.params.q;
    const response = await axios.get(
      backendUrl + `/api/v2/hianime/search/suggestion?q=${q}`
    );
    return res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const fetchSearchResult = async (req, res) => {
  try {
    const q = req.params.q;
    const response = await axios.get(
      backendUrl + `/api/v2/hianime/search?q=${q}`
    );
    return res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Proxy endpoint for M3U8 streams to bypass CORS
export const proxyStream = async (req, res) => {
  const { url } = req.query; // Move this outside try block so it's accessible in catch
  
  try {
    if (!url) {
      return res.status(400).json({ error: "URL parameter is required" });
    }

    // console.log("Proxying stream:", url);

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Range"
    );
    res.setHeader(
      "Access-Control-Expose-Headers",
      "Content-Length, Content-Range, Accept-Ranges"
    );

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Determine the domain for specific header strategies
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Enhanced headers with multiple strategies
    const getHeadersForDomain = (domain, retryAttempt = 0) => {
      const baseHeaders = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "video",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      };

      // Domain-specific strategies
      if (domain.includes('fogtwist') || domain.includes('twist')) {
        if (retryAttempt === 0) {
          return {
            ...baseHeaders,
            "Referer": "https://hianime.to/",
            "Origin": "https://hianime.to",
            "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": '"Windows"'
          };
        } else if (retryAttempt === 1) {
          return {
            ...baseHeaders,
            "Referer": "https://aniwatch.to/",
            "Origin": "https://aniwatch.to",
            "X-Requested-With": "XMLHttpRequest"
          };
        } else {
          return {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Referer": "https://9anime.to/",
            "Origin": "https://9anime.to"
          };
        }
      } else if (domain.includes('lightningflash') || domain.includes('lightning')) {
        if (retryAttempt === 0) {
          // Minimal headers approach - some CDNs block excessive headers
          return {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "*/*"
          };
        } else if (retryAttempt === 1) {
          // Try with different browser and minimal anime site referer
          return {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Referer": "https://hianime.to/"
          };
        } else if (retryAttempt === 2) {
          // Try mobile user agent
          return {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            "Accept": "*/*"
          };
        } else {
          // Last resort: curl-like request
          return {
            "User-Agent": "curl/7.68.0",
            "Accept": "*/*"
          };
        }
      } else if (domain.includes('hianime') || domain.includes('aniwatch')) {
        return {
          ...baseHeaders,
          "Referer": "https://hianime.to/",
          "Origin": "https://hianime.to"
        };
      } else {
        // Generic CDN strategy
        if (retryAttempt === 0) {
          return baseHeaders;
        } else if (retryAttempt === 1) {
          return {
            ...baseHeaders,
            "Referer": "https://hianime.to/",
            "Origin": "https://hianime.to"
          };
        } else {
          return {
            "User-Agent": "VLC/3.0.16 LibVLC/3.0.16",
            "Accept": "*/*"
          };
        }
      }
    };

    if (req.headers.range) {
      // Will be added to headers in the loop
    }

    // Add a small delay to avoid rate limiting - longer for intermittent failures
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));

    // Make request to original stream URL with enhanced retry logic
    let response;
    let retryCount = 0;
    const maxRetries = 4; // Increased to 4 for lightningflash

    while (retryCount <= maxRetries) {
      try {
        const headers = getHeadersForDomain(domain, retryCount);
        
        // Add range header if present
        if (req.headers.range) {
          headers.Range = req.headers.range;
        }

        response = await axios({
          method: "GET",
          url: url,
          headers: headers,
          responseType: "stream",
          timeout: 30000, // 30 second timeout
          maxRedirects: 10,
          validateStatus: function (status) {
            return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
          },
          withCredentials: false,
          decompress: true,
        });
        break; // Success, exit retry loop
      } catch (error) {
        if (error.response?.status === 403 && retryCount < maxRetries) {
          retryCount++;
          console.log(`403 error on ${domain}, retrying with strategy ${retryCount}... (${retryCount}/${maxRetries})`);
          // Exponential backoff with jitter for intermittent failures
          const baseDelay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s, 16s
          const jitter = Math.random() * 1000;
          const delay = baseDelay + jitter;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error; // Re-throw if not 403 or max retries reached
      }
    }

    // Check if this is an M3U8 playlist that needs URL rewriting
    const isM3U8 =
      url.includes(".m3u8") ||
      response.headers["content-type"]?.includes(
        "application/vnd.apple.mpegurl"
      ) ||
      response.headers["content-type"]?.includes("application/x-mpegURL");

    if (isM3U8) {
      // For M3U8 files, we need to rewrite relative URLs
      let data = "";
      response.data.on("data", (chunk) => {
        data += chunk;
      });

      response.data.on("end", () => {
        // Rewrite relative URLs in M3U8 content
        const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
        const rewrittenContent = data
          .replace(
            /^(?!https?:\/\/)([^\r\n]+\.m3u8)$/gm,
            (match, relativePath) => {
              const fullUrl = baseUrl + relativePath;
              return `${proxyBaseUrl}/api/anime/proxy-stream?url=${encodeURIComponent(
                fullUrl
              )}`;
            }
          )
          .replace(
            /^(?!https?:\/\/)([^\r\n]+\.ts)$/gm,
            (match, relativePath) => {
              const fullUrl = baseUrl + relativePath;
              return `${proxyBaseUrl}/api/anime/proxy-stream?url=${encodeURIComponent(
                fullUrl
              )}`;
            }
          );

        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
        res.setHeader("Content-Length", Buffer.byteLength(rewrittenContent));
        res.status(response.status);
        res.send(rewrittenContent);
      });

      response.data.on("error", (streamError) => {
        // console.error("M3U8 processing error:", streamError.message);
        if (!res.headersSent) {
          res
            .status(500)
            .json({
              error: "M3U8 processing error",
              details: streamError.message,
            });
        }
      });
    } else {
      // For non-M3U8 files, pipe directly
      // Forward response headers
      if (response.headers["content-type"]) {
        res.setHeader("Content-Type", response.headers["content-type"]);
      }
      if (response.headers["content-length"]) {
        res.setHeader("Content-Length", response.headers["content-length"]);
      }
      if (response.headers["content-range"]) {
        res.setHeader("Content-Range", response.headers["content-range"]);
      }
      if (response.headers["accept-ranges"]) {
        res.setHeader("Accept-Ranges", response.headers["accept-ranges"]);
      }

      // Set status code
      res.status(response.status);

      // Pipe the stream with error handling
      response.data.on("error", (streamError) => {
        // console.error("Stream piping error:", streamError.message);
        if (!res.headersSent) {
          res
            .status(500)
            .json({ error: "Stream error", details: streamError.message });
        }
      });

      response.data.pipe(res);
    }
  } catch (error) {
    // console.error("Proxy error details:", {
    //   message: error.message,
    //   code: error.code,
    //   response: error.response?.status,
    //   url: url,
    // });

    if (error.response) {
      // Forward the error status from the upstream server
      res.status(error.response.status).json({
        error: `Upstream server error: ${error.response.status}`,
        details: error.message,
      });
    } else if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      res.status(502).json({
        error: "Unable to reach stream server",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Failed to proxy stream",
        details: error.message,
      });
    }
  }
};





export const fetchEpisodeStreamLinks = async (req, res) => {
  try {
    const { episodeId, server, category } =
      req.body;
    // Check if stream data already exists in database
    const existingStream = await StreamLink.findOne({
      episodeId,
      server,
      category,
    });
    if (existingStream) {
      const proxiedSources = rewriteSourcesToProxy(existingStream.sources);
      const streamObj = existingStream.toObject();

      return res.json({
        success: true,
        data: { data: { ...streamObj, sources: proxiedSources } },
      });
    }

    // Fetch from external API if not cached
    const response = await axios.get(
      `${backendUrl}/api/v2/hianime/episode/sources`,
      {
        params: { animeEpisodeId: episodeId, server, category },
      }
    );

    // Store in database
    const streamData = new StreamLink({
      episodeId,
      server,
      category,
      headers: response.data.data.headers,
      tracks: response.data.data.tracks,
      intro: response.data.data.intro,
      outro: response.data.data.outro,
      sources: response.data.data.sources,
      anilistID: response.data.data.anilistID,
      malID: response.data.data.malID,
    });

    await streamData.save();

    // Rewrite sources URLs to go through your HLS proxy
    const proxiedSources = rewriteSourcesToProxy(response.data.data.sources);
   
      
     
    return res.json({
      success: true,
      data: { data: { ...response.data.data, sources: proxiedSources } },
      episodeData
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * Rewrite .m3u8 URLs in the sources to go through your backend proxy
 */
function rewriteSourcesToProxy(sources) {
  if (!sources || !Array.isArray(sources)) return sources;

  return sources.map((source) => {
    if (source.url && source.url.endsWith(".m3u8")) {
      const encodedUrl = encodeURIComponent(source.url);
      source.url = `${proxyBaseUrl}/api/anime/proxy-stream?url=${encodedUrl}`;
    }
    return source;
  });
}
