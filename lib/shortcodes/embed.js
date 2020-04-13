const {extract} = require('oembed-parser');

/**
 * Get embeddable code by querying oEmbed endpoint
 *
 * @param {String} string String, i.e. Foo bar
 * @return {String} Hashtag, i.e. #FooBar
 */
module.exports = async (string) => {
  const queryString = (params) => {
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
  };

  try {
    const url = new URL(string);
    const params = new URLSearchParams(url.search);

    const oembed = await extract(string);
    const {title, thumbnail_url, width, height} = oembed;
    const {href} = url;
    const ratio = width / height;
    let embed;

    switch (oembed.provider_name) {
      case 'Vimeo':
        video_id = thumbnail_url.match(/(\d*)_/)[1];
        embed_url = href.replace('vimeo.com', 'player.vimeo.com/video');
        embed_params = {
          color: 'fff',
          title: 0,
          badge: 0,
          byline: 0,
          portrait: 0,
          autoplay: 1
        };
        embed = `${embed_url}?${queryString(embed_params)}`;
        thumbnail_urls = {
          '320': `https://i.vimeocdn.com/video/${video_id}_320.jpg`,
          '480': `https://i.vimeocdn.com/video/${video_id}_480.jpg`,
          '640': `https://i.vimeocdn.com/video/${video_id}_640.jpg`,
          '1280': `https://i.vimeocdn.com/video/${video_id}_1280.jpg`,
        };
        break;

      case 'YouTube':
        video_id = params.get('v');
        embed_url = `https://www.youtube-nocookie.com/embed/${video_id}`;
        embed_params = {
          modestbranding: 1,
          autoplay: 1
        };
        embed = `${embed_url}?${queryString(embed_params)}`;
        thumbnail_urls = {
          '320': `https://i.ytimg.com/vi/${video_id}/mqdefault.jpg`,
          '480': `https://i.ytimg.com/vi/${video_id}/hqdefault.jpg`,
          '640': `https://i.ytimg.com/vi/${video_id}/sddefault.jpg`,
          '1280': `https://i.ytimg.com/vi/${video_id}/maxresdefault.jpg`,
        };
        break;

      default:
        return string;
    }

    // Convert thumbnail_urls to attribute value for srcset
    const srcset = Object.keys(thumbnail_urls).map(key =>
      `${thumbnail_urls[key]} ${key}w`
    ).join(', ');

    // Generate HTML with data values to progressively enhance
    const html = `<a href="${href}" data-embed-src="${embed}" style="--aspect-ratio: ${ratio}">
      <img src="${thumbnail_url}" srcset="${srcset}" alt="${title}">
    </a>`;

    return html;

  } catch (err) {
    console.warn(`No oEmbed data found at ${string}`)
  }
};
