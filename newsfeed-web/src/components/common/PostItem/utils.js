// FIXME: 接口設計奇怪
export function mapPostTypeToGroupPostType(postType) {
  switch (postType) {
    case 0:
      return 0;
    case 1:
      return null;
    case 2:
      return 1;
    default:
      console.error('postType error');
      return null;
  }
}

export function fromMsgText(editorContent) {
  const entitylist = Object.values(editorContent.entityMap);
  const blocks = editorContent.blocks
    .reverse()
    .map((block) => {
      let blockText = block.text;
      for (let l = block.entityRanges.length, i = l - 1; i >= 0; i--) {
        const entityRanges = block.entityRanges[i];
        const entity = entitylist.pop();
        if (entity) {
          const { data, type } = entity;
          if (type === 'mention') {
            let { id, type, name } = data.mention;
            name = name.replace('@', '');
            const mentionContent =
              type === 'user'
                ? `@<=${id}=>`
                : `[@${name}](newsfeed://mention?type=group&id=${id})`;
            blockText =
              blockText.slice(0, entityRanges.offset) +
              mentionContent +
              blockText.slice(entityRanges.offset + entityRanges.length);
          }
        }
      }
      return blockText;
    })
    .reverse();
  const formattedText = blocks.join('\n').trimRight();
  return formattedText;
}
