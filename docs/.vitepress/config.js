import { defineConfig } from 'vitepress'

// 旺财主题配色
const theme = {
  color: {
    primary: '#ff8c00', // 旺财橙
    secondary: '#ffa500',
    accent: '#ffcc00'
  }
}

export default defineConfig({
  title: '旺财笔记',
  description: 'OpenClaw 学习资料库',
  lang: 'zh-CN',
  outDir: '.vitepress/dist',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }]
  ],
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/quick-start' },
      { text: '教程', link: '/tutorials/hyperframes-basics' },
      { text: '参考', link: '/reference/config-cheatsheet' },
      { text: '关于', link: '/about' }
    ],
    sidebar: {
      '/guide/': [
        { text: '快速开始', link: '/guide/quick-start' },
        { text: '记忆系统', link: '/guide/memory-system' }
      ],
      '/tutorials/': [
        { text: 'HyperFrames 基础', link: '/tutorials/hyperframes-basics' },
        { text: 'DeepSeek 接入 Codex', link: '/tutorials/deepseek-codex-install-guide' }
      ],
      '/reference/': [
        { text: '配置速查', link: '/reference/config-cheatsheet' }
      ]
    },
    search: {
      provider: 'local'
    },
    footer: {
      copyright: '© 2026 旺财笔记'
    },
    // 旺财风格：橙色主题
    logo: {
      src: '/logo.svg',
      width: 24,
      height: 24
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhbcher/wangcai-notes' }
    ]
  }
})
