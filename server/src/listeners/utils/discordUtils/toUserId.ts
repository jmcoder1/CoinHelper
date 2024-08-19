// mention format <@23237y02370235059>

export const toUserId = (mention: string) => {
  return mention.substring(mention.indexOf("@") + 1, mention.indexOf(">"));
};
