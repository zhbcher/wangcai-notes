import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '旺财笔记',
  description: 'OpenClaw 学习资料库',
  lang: 'zh-CN',
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
        { text: 'HyperFrames 基础', link: '/tutorials/hyperframes-basics' }
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
    }
  }
})
