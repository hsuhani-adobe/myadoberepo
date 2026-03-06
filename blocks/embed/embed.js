export default function decorate(block) {

  const image = block.querySelector('picture img');
  const link = block.querySelector('a');
  const caption = block.querySelector(':scope > div:nth-child(2)');

  if (!image || !link) return;

  const videoURL = link.href;

  let videoId = '';

  if (videoURL.includes('youtu.be')) {
    videoId = videoURL.split('/').pop().split('?')[0];
  } else if (videoURL.includes('youtube.com')) {
    videoId = new URL(videoURL).searchParams.get('v');
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'video-wrapper';

  wrapper.innerHTML = `
    <div class="video-thumbnail">
      ${image.outerHTML}
      <div class="play-button"></div>
    </div>
  `;

  wrapper.addEventListener('click', () => {
    wrapper.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>
    `;
  });

  const captionContent = caption ? caption.innerHTML : '';

  block.innerHTML = '';
  block.append(wrapper);

  /* add link below video */
  const linkElement = document.createElement('p');
  linkElement.className = 'video-link';
  linkElement.innerHTML = `<a href="${videoURL}" target="_blank">${videoURL}</a>`;
  block.append(linkElement);

  /* add caption below */
  if (captionContent) {
    const captionElement = document.createElement('div');
    captionElement.className = 'video-caption';
    captionElement.innerHTML = captionContent;
    block.append(captionElement);
  }
}