
import type { JSONContent } from '@tiptap/core';

function getTextFromNode(node: JSONContent): string {
    if (node.type === 'text' && node.text) {
        return node.text;
    }
    if (node.content && Array.isArray(node.content)) {
        // Add a space between block-level nodes for better readability
        const separator = node.type === 'paragraph' || node.type === 'heading' ? ' ' : '';
        return node.content.map(getTextFromNode).join('') + separator;
    }
    return '';
}

export function getPlainTextFromTiptapJson(json: any): string {
    if (!json) {
        return '';
    }
    // Handle legacy string data
    if (typeof json === 'string') {
        return json;
    }
    if (!json.content || !Array.isArray(json.content)) {
        return '';
    }
    return json.content.map(getTextFromNode).join('').trim();
}
