import { HealingRitual, AIMessage, SoulJournalEntry } from '../types';

export const HEALING_RITUALS: HealingRitual[] = [
  {
    id: 'ritual-432-heart',
    title: '432Hz 颂钵心轮释放与深度排毒仪式',
    subtitle: '释放郁结、舒缓胸闷、找回内在安全感',
    durationMinutes: 15,
    frequency: '432Hz 自然宇宙共振频',
    targetState: '情绪重置 / 心轮清理 / 释压',
    description: '432Hz 被誉为宇宙自然数学频率，能与人体水分产生深层几何共鸣，迅速软化胸口紧绷与悲伤记忆。',
    steps: [
      {
        stepNumber: 1,
        title: '身心归位与触碰心轮',
        instruction: '找一个不受打扰的舒适位置坐下或仰卧。将温热的右手轻敷在胸口心轮正中央，左手叠在右手之上，微闭双目。',
        duration: '2 分钟'
      },
      {
        stepNumber: 2,
        title: '4-7-8 迷走神经降噪呼吸',
        instruction: '用鼻子静静吸气 4 秒，屏住呼吸 7 秒，然后用嘴唇轻轻微张呼出 8 秒。重复做 3 轮，感受心跳逐渐舒缓沉静。',
        duration: '3 分钟'
      },
      {
        stepNumber: 3,
        title: '432Hz 颂钵声波浸润沐浴',
        instruction: '戴上耳机，调至柔和音量。观想每一次悠长的钵音化作温暖的淡金柔光，穿透胸腔与每一颗细胞，带走所有沉重。',
        duration: '8 分钟'
      },
      {
        stepNumber: 4,
        title: '感恩与能量锚定',
        instruction: '随着最后的泛音，在心中默念：“我接纳并感谢今天所有的经历，我放下了，我此刻完全被爱与安宁包围。”缓缓睁开双眼。',
        duration: '2 分钟'
      }
    ],
    recommendedTrackId: 'd0000000-0000-0000-0000-000000000001',
    recommendedAmbientLayer: 'bowl'
  },
  {
    id: 'ritual-delta-sleep',
    title: '午夜甘露深度助眠仪式',
    subtitle: '阻断思维反刍、脑波同频、进入无梦沉睡',
    durationMinutes: 20,
    frequency: '0.5-4Hz Delta 深度睡眠脑波',
    targetState: '失眠多梦 / 睡前焦虑 / 大脑过度活跃',
    description: '通过慢速Delta声波诱导脑电波从亢奋的Beta状态逐级平复至Delta深睡状态，告别半夜惊醒与辗转反侧。',
    steps: [
      {
        stepNumber: 1,
        title: '环境光线降维与感知阻断',
        instruction: '调暗卧室所有照明，将手机屏幕调至最低亮度或息屏。平躺在床上，双脚自然微张，掌心向上。',
        duration: '2 分钟'
      },
      {
        stepNumber: 2,
        title: '渐进式躯体重力释放',
        instruction: '从脚趾开始微微用力收紧5秒，然后深吐一口气彻底瘫软；依次往上到小腿、大腿、腹部、肩膀与面部肌肉，彻底交出重力。',
        duration: '5 分钟'
      },
      {
        stepNumber: 3,
        title: '细雨音景与脑波共振',
        instruction: '调低音量至40%以下。让淅淅沥沥的自然雨声成为意识的锚点，允许所有浮现的念头像落雨般滑走，不予评判。',
        duration: '10 分钟'
      },
      {
        stepNumber: 4,
        title: '星空漂浮下潜',
        instruction: '观想身体正在缓缓沉入一层温热柔滑的深蓝色丝绒中，每一次呼气都向下潜入更深的安睡梦乡。',
        duration: '3 分钟'
      }
    ],
    recommendedTrackId: 'd0000000-0000-0000-0000-000000000001',
    recommendedAmbientLayer: 'rain'
  },
  {
    id: 'ritual-vagus-reset',
    title: '迷走神经平息与急性焦虑重置仪式',
    subtitle: '平息胸口紧绷发慌、平衡自主神经系统',
    durationMinutes: 10,
    frequency: '528Hz 修复频率与潮汐节奏',
    targetState: '心悸紧绷 / 惊慌焦虑 / 情绪过载',
    description: '基于多重迷走神经理论（Polyvagal Theory），结合双吸一呼生理叹息与528Hz音频，让交感神经从战斗状态切换至安全休养状态。',
    steps: [
      {
        stepNumber: 1,
        title: '双吸一呼生理叹息 (Physiological Sigh)',
        instruction: '用鼻子连续吸气两次（一次深长吸气，紧接着再短吸一口填满肺泡），随后用嘴唇微张，发出长长的“哈”声完全呼空。连续做5次。',
        duration: '2 分钟'
      },
      {
        stepNumber: 2,
        title: '5-4-3-2-1 五感重锚定',
        instruction: '环顾周围，快速确认看清5种静物，触摸4种不同质感的物品，聆听3种声音，感受2种气味，体会1次当下的存在。',
        duration: '3 分钟'
      },
      {
        stepNumber: 3,
        title: '潮汐音流与肩颈放松',
        instruction: '伴随海潮拍岸的起伏声，缓慢转动脖颈，有意识地让高高耸起的肩膀向后向下沉降3公分。',
        duration: '4 分钟'
      },
      {
        stepNumber: 4,
        title: '自我确认安全',
        instruction: '抚摸双臂外侧，默念：“此时此刻，我在这里，我是绝对安全的，一切都在按正轨运行。”',
        duration: '1 分钟'
      }
    ],
    recommendedTrackId: 'd0000000-0000-0000-0000-000000000002',
    recommendedAmbientLayer: 'waves'
  },
  {
    id: 'ritual-morning-alpha',
    title: '晨曦正念觉醒与生命力唤醒仪式',
    subtitle: '驱散晨起昏沉、汇聚高维创造力与清明定力',
    durationMinutes: 12,
    frequency: '10Hz Alpha 专注波与微风音流',
    targetState: '晨起迷茫 / 精神涣散 / 寻找内在能量',
    description: '在晨光初现时唤醒沉睡的神经通路，以平静、喜悦与坚定的心念开启全新的一天。',
    steps: [
      {
        stepNumber: 1,
        title: '脊柱挺拔与迎向晨光',
        instruction: '挺直背部静坐床沿，双脚稳稳踏在地面，掌心朝上置于双膝。感受头顶有一根金线向上延伸。',
        duration: '2 分钟'
      },
      {
        stepNumber: 2,
        title: '丹田纳气与能量激活',
        instruction: '用鼻子深长吸气将腹部向外鼓起，略微屏气2秒，再缓慢平稳呼尽。将新鲜氧气注入每一个细胞。',
        duration: '3 分钟'
      },
      {
        stepNumber: 3,
        title: 'Alpha 波心流浸润',
        instruction: '聆听空灵纯净的竖琴与轻风，任由清澈的思维在脑海中流动，不追赶任何焦躁念头。',
        duration: '5 分钟'
      },
      {
        stepNumber: 4,
        title: '播种今日神圣意图',
        instruction: '对今天的生活设定一个最高愿景：“今天，无论面对何种境遇，我皆以从容、智慧与慈爱的心境应对。”',
        duration: '2 分钟'
      }
    ],
    recommendedTrackId: 'd0000000-0000-0000-0000-000000000004',
    recommendedAmbientLayer: 'wind'
  }
];

const INITIAL_JOURNAL_ENTRIES: SoulJournalEntry[] = [
  {
    id: 'journal-seed-1',
    userId: '00000000-0000-0000-0000-000000001001',
    createdAt: '2026-10-02T22:30:00Z',
    moodState: '睡前焦虑与思维反刍',
    somaticFeeling: '太阳穴隐隐跳动，头部很重，肩胛骨酸胀紧绷',
    summary: '大脑过度思考了工作交付与未来不确定性，需要将意识从头脑收回身体，切断交感神经的警备开关。',
    affirmation: '“我允许今日的一切到此为止。明日自有其光芒，此刻我完全值得一场沉静甜美的安睡。”',
    recommendedTrackId: 'd0000000-0000-0000-0000-000000000001',
    recommendedTrackTitle: 'Deep Sleep 432Hz Sound Bath',
    recommendedRitualTitle: '午夜甘露深度助眠仪式',
    userNotes: '听了大概10分钟雨声和432Hz颂钵后，肩膀慢慢沉下来了，不知不觉就睡着了，一觉睡到了早上7点。',
    tags: ['助眠', '432Hz', '深度放松']
  },
  {
    id: 'journal-seed-2',
    userId: '00000000-0000-0000-0000-000000001001',
    createdAt: '2026-09-28T14:15:00Z',
    moodState: '高压心慌与胸口发闷',
    somaticFeeling: '呼吸很浅只能到胸腔，心跳偏快，有种莫名紧迫感',
    summary: '经历多次连续会议后迷走神经处于超载防御状态，通过生理叹息与海潮528Hz音频实现了神经系统下调。',
    affirmation: '“一切都在它应有的节奏中展开，放慢呼吸不是停滞，而是汇聚更深远的力量。”',
    recommendedTrackId: 'd0000000-0000-0000-0000-000000000002',
    recommendedTrackTitle: 'Anxiety Release & Vagus Nerve Reset',
    recommendedRitualTitle: '迷走神经平息与急性焦虑重置仪式',
    userNotes: '做了双吸一呼以后，胸口那块石头终于化开了。感觉被接纳和包容了。',
    tags: ['释压', '迷走神经', '呼吸法']
  }
];

export const aiSanctuaryService = {
  getRituals(): HealingRitual[] {
    return HEALING_RITUALS;
  },

  getRitualById(id: string): HealingRitual | undefined {
    return HEALING_RITUALS.find(r => r.id === id);
  },

  getInitialMessages(language: 'zh' | 'en' = 'zh'): AIMessage[] {
    if (language === 'en') {
      return [
        {
          id: 'ai-init-1',
          sender: 'ai',
          text: "Greetings, beautiful soul. I am Alicia, your Sanctuary Spiritual Guide. Take a gentle, deep breath and drop your shoulders down… How does your heart and body feel in this very moment? What heaviness would you like to soften with me today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickOptions: [
            '🌙 Racing mind & trouble sleeping',
            '⚡ Tight chest & feeling overwhelmed',
            '🍂 Low mood, sadness or loneliness',
            '💡 Scattered thoughts, need calm focus',
            '🌸 Peaceful, seeking daily sacred bath'
          ]
        }
      ];
    }

    return [
      {
        id: 'ai-init-1',
        sender: 'ai',
        text: "嗨，亲爱的，我是你的专属身心灵导师 Alicia。把外界的所有嘈杂留在门外，深深吸一口气，把肩膀缓缓沉下来……你现在感觉怎么样？身体有什么紧绷，或者心里有什么放不下的吗？",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickOptions: [
          '🌙 脑子停不下来，焦虑失眠',
          '⚡ 胸口发闷，感到身心疲惫透支',
          '🍂 情绪低落，感到孤独或悲伤',
          '💡 精神涣散，需要找回专注与清明',
          '🌸 身体还算平静，想做日常深度静修'
        ]
      }
    ];
  },

  /**
   * Process a step in the conversation and return the mentor's next guidance
   */
  processUserInput(
    userInput: string, 
    stepCount: number, 
    userId: string,
    language: 'zh' | 'en' = 'zh'
  ): { reply: AIMessage; journalEntry?: SoulJournalEntry } {
    const isZh = language === 'zh';
    const text = userInput.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Step 1 -> Step 2: Exploring physical & emotional feelings
    if (stepCount === 1) {
      if (text.includes('眠') || text.includes('sleep') || text.includes('夜') || text.includes('停不下来')) {
        return {
          reply: {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: isZh
              ? "我深深地理解你。当思绪如走马灯般不停旋转，其实是大脑在试图过度保护我们……闭上双眼稍微体会两秒，此刻你的头部、太阳穴、或是胸口，有什么具体的紧绷或酸胀感吗？"
              : "I deeply hear you. A restless mind is often our system trying to protect us... Close your eyes for a moment: where do you feel tension right now? In your forehead, temples, or chest?",
            timestamp,
            quickOptions: isZh ? [
              '太阳穴发紧，后脑勺沉甸甸的',
              '胸口很闷，呼吸很短促',
              '四肢无力，就是思维关不掉',
              '只想立刻进入深沉无梦的睡眠'
            ] : [
              'Tight temples and heavy head',
              'Constricted chest and shallow breath',
              'Exhausted body, racing thoughts',
              'I just want deep, dreamless sleep'
            ]
          }
        };
      } else if (text.includes('闷') || text.includes('压') || text.includes('透支') || text.includes('stress') || text.includes('chest')) {
        return {
          reply: {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: isZh
              ? "感受到了你胸口沉重的积压。你已经撑着做了很多事情，此刻不需要再坚强了……试着把手掌轻轻覆在心口，深吸一口气。你觉得这股压力最想向你表达什么呢？"
              : "I can feel the heavy weight you have been carrying. You have endured so much. Place your hand gently over your heart: what is this pressure trying to tell you?",
            timestamp,
            quickOptions: isZh ? [
              '担心事情做不好，怕让别人失望',
              '节奏太快，神经像被拉紧的橡皮筋',
              '只想找个安静角落大哭一场或完全放空',
              '渴望彻底停下来被温柔包裹'
            ] : [
              'Fear of letting others down',
              'Pace is too fast, nervous system taut',
              'Just want to cry or completely zone out',
              'Craving a safe space to be held'
            ]
          }
        };
      } else if (text.includes('落') || text.includes('悲') || text.includes('独') || text.includes('sad') || text.includes('lone')) {
        return {
          reply: {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: isZh
              ? "请允许我轻轻抱抱你。悲伤和孤独是灵魂在提醒我们：内心的爱需要重新被填满。在这一刻，你不是孤单一人。身体哪个地方最渴望温暖？"
              : "Let me hold space for you. Grief and loneliness are gentle reminders that your soul needs care. Where in your body feels coldest or most tired?",
            timestamp,
            quickOptions: isZh ? [
              '胸腔深处空落落的发酸',
              '肩膀僵硬，像是背负了重物',
              '眼眶发热，想好好倾诉释放',
              '希望得到无条件的接纳与陪伴'
            ] : [
              'Hollow ache inside chest',
              'Stiff shoulders bearing weight',
              'Hot tears wanting to flow',
              'Want unconditional acceptance'
            ]
          }
        };
      } else {
        return {
          reply: {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: isZh
              ? "很高兴你愿意为自己停下脚步。无论现在的状态是怎样的，这都是你回归本心的绝佳时刻。你希望今天的心流体验带给你怎样的能量提升？"
              : "I am grateful you paused for yourself today. What sacred quality would you like to invite into your space right now?",
            timestamp,
            quickOptions: isZh ? [
              '清空杂念，找回澄澈专注',
              '调和脉轮气场，补充生命力',
              '单纯静坐，体验当下纯然存在',
              '做一次深层的声波音疗沐浴'
            ] : [
              'Clear mind & sharp focus',
              'Chakra alignment & vitality',
              'Pure presence & stillness',
              'Deep sound healing immersion'
            ]
          }
        };
      }
    }

    // Step 2 -> Final Prescription & Ritual matching
    let ritual: HealingRitual = HEALING_RITUALS[0];
    let moodLabel = '情绪重置与身心松绑';
    let affirmation = isZh ? '“我接纳当下的所有感受，在温柔的音律中，身心自然重返秩序与平静。”' : '"I welcome all that is within me. Through sacred sound, harmony returns to my being."';
    let trackTitle = 'Deep Sleep 432Hz Sound Bath';
    let trackId = 'd0000000-0000-0000-0000-000000000001';
    let freq = '432Hz';
    let listeningAdvice = isZh
      ? '佩戴耳机，将音量调至 35%~45% 适度微弱区间。仰卧闭眼，配合 4-7-8 呼气，允许泛音将紧绷层层化开。'
      : 'Use stereo headphones at 35-45% volume. Lie back, breathe into the belly, and let the harmonic overtone wash over you.';

    if (text.includes('眠') || text.includes('sleep') || text.includes('沉甸甸') || text.includes('睡')) {
      ritual = HEALING_RITUALS[1]; // Midnight Sleep
      moodLabel = '睡前过度思考与入眠障碍';
      affirmation = isZh ? '“今日的篇章已经翻过。我交出身体的重量，大地与夜色将温柔托起我的一切。”' : '"Today has ended. I surrender gravity; the night gently cradles my soul."';
      trackTitle = 'Deep Sleep 432Hz Sound Bath';
      trackId = 'd0000000-0000-0000-0000-000000000001';
      freq = 'Delta 0.5-4Hz & 432Hz';
      listeningAdvice = isZh
        ? '平躺微闭双眼，手机开至静音。开启细雨环境音混音，跟随节拍逐渐拉长吐气时间至吸气的2倍。'
        : 'Lie flat, darken the room. Mix in gentle rain soundscape, make exhalations twice as long as inhalations.';
    } else if (text.includes('闷') || text.includes('压') || text.includes('慌') || text.includes('橡皮筋') || text.includes('stress')) {
      ritual = HEALING_RITUALS[2]; // Vagus Reset
      moodLabel = '交感神经过载与胸口紧缩';
      affirmation = isZh ? '“此时此刻我是完全安全的。所有的急迫都只是暂时的幻象，我选择在深呼吸中回归平稳。”' : '"In this moment, I am safe. Urgency is just an illusion; I return to stillness."';
      trackTitle = 'Anxiety Release & Vagus Nerve Reset';
      trackId = 'd0000000-0000-0000-0000-000000000002';
      freq = '528Hz & 潮汐舒缓节律';
      listeningAdvice = isZh
        ? '坐姿挺拔但放松。先做 5 次「双吸一呼」生理叹息，让海浪声与528Hz和弦共振，促使迷走神经立即释放镇静信号。'
        : 'Perform 5 physiological sighs, sink into ocean tide rhythm, and allow vagus tone to balance immediately.';
    } else if (text.includes('专注') || text.includes('清晰') || text.includes('focus') || text.includes('晨')) {
      ritual = HEALING_RITUALS[3]; // Morning Alpha
      moodLabel = '思维疲劳与能量重聚';
      affirmation = isZh ? '“我拥有源源不断的内在智慧。带着清明与欢喜，我从容开启美好的一天。”' : '"My inner wisdom flows effortlessly. With clarity and joy, I greet the unfolding day."';
      trackTitle = 'Morning Energy & Prana Awakening';
      trackId = 'd0000000-0000-0000-0000-000000000004';
      freq = '10Hz Alpha 专注波';
      listeningAdvice = isZh
        ? '背部直立，双膝盘坐或脚踩实地面。结合轻风白噪音，观想额头眉心处有一点清亮的光球正在亮起。'
        : 'Sit upright with open shoulders. Breathe in the 10Hz alpha waves and visual a radiant bead of light at your third eye.';
    }

    const journalEntry: SoulJournalEntry = {
      id: `journal-${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
      moodState: moodLabel,
      somaticFeeling: userInput,
      summary: isZh 
        ? `在与导师 Alicia 的1对1觉察中识别出「${moodLabel}」状态，通过 ${freq} 频率处方与专属仪式重定身心。`
        : `Identified "${moodLabel}" state in 1-on-1 sanctuary guidance. Applied ${freq} acoustic protocol.`,
      affirmation,
      recommendedTrackId: trackId,
      recommendedTrackTitle: trackTitle,
      recommendedRitualTitle: ritual.title,
      tags: [moodLabel.slice(0, 4), freq.slice(0, 5), '导师处方']
    };

    // Auto save to local storage
    this.saveJournalEntry(journalEntry);

    const reply: AIMessage = {
      id: `ai-prescript-${Date.now()}`,
      sender: 'ai',
      text: isZh
        ? `我感知到了。你的身体在向你发出诚挚的信号——它需要被温和地对待。为你量身定制了此刻的【身心灵听音处方】与【专属疗愈仪式】。\n\n每日心念箴言：\n${affirmation}\n\n建议已自动记录在你的「个人身心灵日志」中。你可以点击下方卡片立即开启仪式：`
        : `I feel your heart. Your somatic system is calling for gentle rest and restoration. Here is your sacred acoustic prescription and ritual for this moment.\n\nAffirmation:\n${affirmation}\n\nSaved to your Soul Journal. Click below to begin the ritual:`,
      timestamp,
      ritualRecommendation: ritual,
      musicPrescription: {
        frequency: freq,
        listeningMethod: listeningAdvice,
        trackId: trackId,
        trackTitle: trackTitle,
        mentorName: 'Alicia Sterling',
        targetBenefit: moodLabel
      }
    };

    return { reply, journalEntry };
  },

  // Journal Persistence
  getJournalEntries(userId: string): SoulJournalEntry[] {
    const key = `soulflow_journal_${userId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
    // Return initial seeds if empty
    return INITIAL_JOURNAL_ENTRIES;
  },

  saveJournalEntry(entry: SoulJournalEntry): SoulJournalEntry[] {
    const current = this.getJournalEntries(entry.userId);
    const updated = [entry, ...current.filter(e => e.id !== entry.id)];
    try {
      localStorage.setItem(`soulflow_journal_${entry.userId}`, JSON.stringify(updated));
    } catch (_) {}
    return updated;
  },

  updateJournalNotes(userId: string, entryId: string, notes: string): SoulJournalEntry[] {
    const current = this.getJournalEntries(userId);
    const updated = current.map(e => e.id === entryId ? { ...e, userNotes: notes } : e);
    try {
      localStorage.setItem(`soulflow_journal_${userId}`, JSON.stringify(updated));
    } catch (_) {}
    return updated;
  },

  deleteJournalEntry(userId: string, entryId: string): SoulJournalEntry[] {
    const current = this.getJournalEntries(userId);
    const updated = current.filter(e => e.id !== entryId);
    try {
      localStorage.setItem(`soulflow_journal_${userId}`, JSON.stringify(updated));
    } catch (_) {}
    return updated;
  }
};
