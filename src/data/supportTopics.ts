export const supportTopics = [
  {
    id: 'exam',
    title: '考试压力',
    description: '把紧绷的节奏慢慢理顺',
    emotion: '压力',
    draft: '最近考试和复习让我压力很大，我想一起梳理一下。',
  },
  {
    id: 'relationships',
    title: '人际关系',
    description: '说说那些难开口的感受',
    emotion: '焦虑',
    draft: '最近的人际关系让我有些困扰，我想说说我的感受。',
  },
  {
    id: 'sleep',
    title: '睡眠困扰',
    description: '给忙碌的思绪一个停顿',
    emotion: '睡眠困扰',
    draft: '最近总是睡不好，脑海里有很多事情，我想聊一聊。',
  },
  {
    id: 'work',
    title: '工作压力',
    description: '找到更适合自己的步调',
    emotion: '压力',
    draft: '最近工作上的事情让我很疲惫，我想找到一个可行的小步骤。',
  },
] as const
export function getSupportTopic(id: unknown) {
  return supportTopics.find((topic) => topic.id === id)
}
