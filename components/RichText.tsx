import React from 'react'

interface RichTextProps {
  content: any
}

// Simple recursive renderer for Lexical content
const renderNode = (node: any, index: number): React.ReactNode => {
  if (!node) return null

  if (typeof node === 'string') {
    return node
  }

  if (Array.isArray(node)) {
    return node.map((child, i) => renderNode(child, i))
  }

  const { type, children, text, tag, format } = node

  // Handle text nodes
  if (text !== undefined) {
    let element = <span key={index}>{text}</span>

    if (format) {
      if (format & 1) element = <strong key={index}>{text}</strong> // bold
      if (format & 2) element = <em key={index}>{text}</em> // italic
      if (format & 4) element = <u key={index}>{text}</u> // underline
      if (format & 8) element = <code key={index}>{text}</code> // code
    }

    return element
  }

  // Handle element nodes
  const childContent = children ? children.map((child: any, i: number) => renderNode(child, i)) : null

  switch (type) {
    case 'paragraph':
      return <p key={index}>{childContent}</p>
    case 'heading':
      const HeadingTag = tag || 'h2'
      return React.createElement(HeadingTag, { key: index }, childContent)
    case 'list':
      return tag === 'ol' ? (
        <ol key={index}>{childContent}</ol>
      ) : (
        <ul key={index}>{childContent}</ul>
      )
    case 'listitem':
      return <li key={index}>{childContent}</li>
    case 'quote':
      return <blockquote key={index}>{childContent}</blockquote>
    case 'link':
      return (
        <a key={index} href={node.url} target={node.newTab ? '_blank' : undefined} rel={node.newTab ? 'noopener noreferrer' : undefined}>
          {childContent}
        </a>
      )
    case 'linebreak':
      return <br key={index} />
    default:
      return <div key={index}>{childContent}</div>
  }
}

export default function RichText({ content }: RichTextProps) {
  if (!content) {
    return null
  }

  // Handle root node
  const root = content.root || content
  const children = root.children || []

  return (
    <div className="rich-text">
      {children.map((node: any, index: number) => renderNode(node, index))}
    </div>
  )
}
