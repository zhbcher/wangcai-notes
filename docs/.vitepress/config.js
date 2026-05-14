import { defineConfig } from 'vitepress'
import { readdirSync } from 'fs'
import { join } from 'path'

// 自动扫描 docs/tutorials 目录生成 sidebar
function getTutorialSidebar() {
  const tutorialsDir = join(__dirname, '..', 'tutorials') // 从 .vitepress/ 回到 docs/
  const files = readdirSync(tutorialsDir)
    .filter(f => f.endsWith('.md') && !f.includes('README'))
    .map(f => {
      const name = f.replace('.md', '')
      const title = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      return { text: title, link: `/tutorials/${name}` }
    })
    .sort((a, b) => a.text.localeCompare(b.text))
  return [{ text: '全部教程', items: files }]
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
        { text: '记忆系统', link: '/guide/memory-system' },
        { text: '技能使用', link: '/guide/skills' }
      ],
      '/tutorials/': getTutorialSidebar(),
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
