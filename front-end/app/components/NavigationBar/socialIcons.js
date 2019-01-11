export const socialIcons = [
    { name: 'reddit', href: 'https://www.reddit.com/user/MyBit_DApp/', icon: require('./socialIcons/reddit.png'), iconHover: require('./socialIcons/reddit-hover.png')},
    { name: 'twitter', href: 'https://twitter.com/MyBit_DApp', icon: require('./socialIcons/twitter.png'), iconHover: require('./socialIcons/twitter-hover.png')},
    { name: 'youtube', href: 'https://www.youtube.com/channel/UCtLn7Vi-3VbsY5F9uF1RJYg', icon: require('./socialIcons/youtube.png'), iconHover: require('./socialIcons/youtube-hover.png')},
    { name: 'facebook', href: 'https://www.facebook.com/MyBitDApp/', icon: require('./socialIcons/facebook.png'), iconHover: require('./socialIcons/facebook-hover.png')},
    { name: 'discord', href: 'https://discord.gg/pfNkVkJ', icon: require('./socialIcons/discord.png'), iconHover: require('./socialIcons/discord-hover.png') },
    { name: 'telegram', href: 'https://t.me/mybitio', icon: require('./socialIcons/telegram.png'), iconHover: require('./socialIcons/telegram-hover.png')},
    { name: 'linkedin', href: 'https://www.linkedin.com/company/mybit/', icon: require('./socialIcons/linkedin.png'), iconHover: require('./socialIcons/linkedin-hover.png')},
  ]


export const generateIconsCss = () => {
  const css = socialIcons.map(icon => {
    return`
      .socialIcon--is-${icon.name} {
        background: url(${icon.icon});
      }
      .socialIcon--is-${icon.name}:hover {
        background: url(${icon.iconHover});
      }
    `;
  })
  return css;
}
