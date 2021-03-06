// let dicts = document.getElementsByTagName('array')[0].getElementsByTagName('dict');
// let emojiData = [];
// for (let i = 0; i < dicts.length; i++) {
//   const item = dicts[i];
//   const keys = item.querySelectorAll('key');
//   const values = item.querySelectorAll('string');
//   let emoji = {};
//   for (let i = 0; i < keys.length; i++) {
//     const key = keys[i];
//     emoji[key.innerHTML] = values[i].innerHTML;
//   }
//   emojiData.push(emoji)
// }

const wechatEmoji = [
  {
    chs: '[微笑]',
    cht: '[微笑]',
    eng: '[Smile]',
    gif: '',
    png: 'Expression_1.png',
    type: '0',
  },
  {
    chs: '[撇嘴]',
    cht: '[撇嘴]',
    eng: '[Grimace]',
    gif: '',
    png: 'Expression_2.png',
    type: '0',
  },
  {
    chs: '[色]',
    cht: '[色]',
    eng: '[Drool]',
    gif: '',
    png: 'Expression_3.png',
    type: '0',
  },
  {
    chs: '[发呆]',
    cht: '[發呆]',
    eng: '[Scowl]',
    gif: '',
    png: 'Expression_4.png',
    type: '0',
  },
  {
    chs: '[得意]',
    cht: '[得意]',
    eng: '[CoolGuy]',
    gif: '',
    png: 'Expression_5.png',
    type: '0',
  },
  {
    chs: '[流泪]',
    cht: '[流淚]',
    eng: '[Sob]',
    gif: '',
    png: 'Expression_6.png',
    type: '0',
  },
  {
    chs: '[害羞]',
    cht: '[害羞]',
    eng: '[Shy]',
    gif: '',
    png: 'Expression_7.png',
    type: '0',
  },
  {
    chs: '[闭嘴]',
    cht: '[閉嘴]',
    eng: '[Silent]',
    gif: '',
    png: 'Expression_8.png',
    type: '0',
  },
  {
    chs: '[睡]',
    cht: '[睡]',
    eng: '[Sleep]',
    gif: '',
    png: 'Expression_9.png',
    type: '0',
  },
  {
    chs: '[大哭]',
    cht: '[大哭]',
    eng: '[Cry]',
    gif: '',
    png: 'Expression_10.png',
    type: '0',
  },
  {
    chs: '[尴尬]',
    cht: '[尷尬]',
    eng: '[Awkward]',
    gif: '',
    png: 'Expression_11.png',
    type: '0',
  },
  {
    chs: '[发怒]',
    cht: '[發怒]',
    eng: '[Angry]',
    gif: '',
    png: 'Expression_12.png',
    type: '0',
  },
  {
    chs: '[调皮]',
    cht: '[調皮]',
    eng: '[Tongue]',
    gif: '',
    png: 'Expression_13.png',
    type: '0',
  },
  {
    chs: '[呲牙]',
    cht: '[呲牙]',
    eng: '[Grin]',
    gif: '',
    png: 'Expression_14.png',
    type: '0',
  },
  {
    chs: '[惊讶]',
    cht: '[驚訝]',
    eng: '[Surprise]',
    gif: '',
    png: 'Expression_15.png',
    type: '0',
  },
  {
    chs: '[难过]',
    cht: '[難過]',
    eng: '[Frown]',
    gif: '',
    png: 'Expression_16.png',
    type: '0',
  },
  {
    chs: '[酷]',
    cht: '[酷]',
    eng: '[Ruthless]',
    gif: '',
    png: 'Expression_17.png',
    type: '0',
  },
  {
    chs: '[冷汗]',
    cht: '[冷汗]',
    eng: '[Blush]',
    gif: '',
    png: 'Expression_18.png',
    type: '0',
  },
  {
    chs: '[抓狂]',
    cht: '[抓狂]',
    eng: '[Scream]',
    gif: '',
    png: 'Expression_19.png',
    type: '0',
  },
  {
    chs: '[吐]',
    cht: '[吐]',
    eng: '[Puke]',
    gif: '',
    png: 'Expression_20.png',
    type: '0',
  },
  {
    chs: '[偷笑]',
    cht: '[偷笑]',
    eng: '[Chuckle]',
    gif: '',
    png: 'Expression_21.png',
    type: '0',
  },
  {
    chs: '[愉快]',
    cht: '[愉快]',
    eng: '[Joyful]',
    gif: '',
    png: 'Expression_22.png',
    type: '0',
  },
  {
    chs: '[白眼]',
    cht: '[白眼]',
    eng: '[Slight]',
    gif: '',
    png: 'Expression_23.png',
    type: '0',
  },
  {
    chs: '[傲慢]',
    cht: '[傲慢]',
    eng: '[Smug]',
    gif: '',
    png: 'Expression_24.png',
    type: '0',
  },
  {
    chs: '[饥饿]',
    cht: '[饑餓]',
    eng: '[Hungry]',
    gif: '',
    png: 'Expression_25.png',
    type: '0',
  },
  {
    chs: '[困]',
    cht: '[累]',
    eng: '[Drowsy]',
    gif: '',
    png: 'Expression_26.png',
    type: '0',
  },
  {
    chs: '[惊恐]',
    cht: '[驚恐]',
    eng: '[Panic]',
    gif: '',
    png: 'Expression_27.png',
    type: '0',
  },
  {
    chs: '[流汗]',
    cht: '[流汗]',
    eng: '[Sweat]',
    gif: '',
    png: 'Expression_28.png',
    type: '0',
  },
  {
    chs: '[憨笑]',
    cht: '[大笑]',
    eng: '[Laugh]',
    gif: '',
    png: 'Expression_29.png',
    type: '0',
  },
  {
    chs: '[悠闲]',
    cht: '[悠閑]',
    eng: '[Commando]',
    gif: '',
    png: 'Expression_30.png',
    type: '0',
  },
  {
    chs: '[奋斗]',
    cht: '[奮鬥]',
    eng: '[Determined]',
    gif: '',
    png: 'Expression_31.png',
    type: '0',
  },
  {
    chs: '[咒骂]',
    cht: '[咒罵]',
    eng: '[Scold]',
    gif: '',
    png: 'Expression_32.png',
    type: '0',
  },
  {
    chs: '[疑问]',
    cht: '[疑問]',
    eng: '[Shocked]',
    gif: '',
    png: 'Expression_33.png',
    type: '0',
  },
  {
    chs: '[嘘]',
    cht: '[噓]',
    eng: '[Shhh]',
    gif: '',
    png: 'Expression_34.png',
    type: '0',
  },
  {
    chs: '[晕]',
    cht: '[暈]',
    eng: '[Dizzy]',
    gif: '',
    png: 'Expression_35.png',
    type: '0',
  },
  {
    chs: '[疯了]',
    cht: '[瘋了]',
    eng: '[Tormented]',
    gif: '',
    png: 'Expression_36.png',
    type: '0',
  },
  {
    chs: '[衰]',
    cht: '[衰]',
    eng: '[Toasted]',
    gif: '',
    png: 'Expression_37.png',
    type: '0',
  },
  {
    chs: '[骷髅]',
    cht: '[骷髏頭]',
    eng: '[Skull]',
    gif: '',
    png: 'Expression_38.png',
    type: '0',
  },
  {
    chs: '[敲打]',
    cht: '[敲打]',
    eng: '[Hammer]',
    gif: '',
    png: 'Expression_39.png',
    type: '0',
  },
  {
    chs: '[再见]',
    cht: '[再見]',
    eng: '[Wave]',
    gif: '',
    png: 'Expression_40.png',
    type: '0',
  },
  {
    chs: '[擦汗]',
    cht: '[擦汗]',
    eng: '[Speechless]',
    gif: '',
    png: 'Expression_41.png',
    type: '0',
  },
  {
    chs: '[抠鼻]',
    cht: '[摳鼻]',
    eng: '[NosePick]',
    gif: '',
    png: 'Expression_42.png',
    type: '0',
  },
  {
    chs: '[鼓掌]',
    cht: '[鼓掌]',
    eng: '[Clap]',
    gif: '',
    png: 'Expression_43.png',
    type: '0',
  },
  {
    chs: '[糗大了]',
    cht: '[羞辱]',
    eng: '[Shame]',
    gif: '',
    png: 'Expression_44.png',
    type: '0',
  },
  {
    chs: '[坏笑]',
    cht: '[壞笑]',
    eng: '[Trick]',
    gif: '',
    png: 'Expression_45.png',
    type: '0',
  },
  {
    chs: '[左哼哼]',
    cht: '[左哼哼]',
    eng: '[Bah！L]',
    gif: '',
    png: 'Expression_46.png',
    type: '0',
  },
  {
    chs: '[右哼哼]',
    cht: '[右哼哼]',
    eng: '[Bah！R]',
    gif: '',
    png: 'Expression_47.png',
    type: '0',
  },
  {
    chs: '[哈欠]',
    cht: '[哈欠]',
    eng: '[Yawn]',
    gif: '',
    png: 'Expression_48.png',
    type: '0',
  },
  {
    chs: '[鄙视]',
    cht: '[鄙視]',
    eng: '[Pooh-pooh]',
    gif: '',
    png: 'Expression_49.png',
    type: '0',
  },
  {
    chs: '[委屈]',
    cht: '[委屈]',
    eng: '[Shrunken]',
    gif: '',
    png: 'Expression_50.png',
    type: '0',
  },
  {
    chs: '[快哭了]',
    cht: '[快哭了]',
    eng: '[TearingUp]',
    gif: '',
    png: 'Expression_51.png',
    type: '0',
  },
  {
    chs: '[阴险]',
    cht: '[陰險]',
    eng: '[Sly]',
    gif: '',
    png: 'Expression_52.png',
    type: '0',
  },
  {
    chs: '[亲亲]',
    cht: '[親親]',
    eng: '[Kiss]',
    gif: '',
    png: 'Expression_53.png',
    type: '0',
  },
  {
    chs: '[吓]',
    cht: '[嚇]',
    eng: '[Wrath]',
    gif: '',
    png: 'Expression_54.png',
    type: '0',
  },
  {
    chs: '[可怜]',
    cht: '[可憐]',
    eng: '[Whimper]',
    gif: '',
    png: 'Expression_55.png',
    type: '0',
  },
  {
    chs: '[菜刀]',
    cht: '[菜刀]',
    eng: '[Cleaver]',
    gif: '',
    png: 'Expression_56.png',
    type: '0',
  },
  {
    chs: '[西瓜]',
    cht: '[西瓜]',
    eng: '[Watermelon]',
    gif: '',
    png: 'Expression_57.png',
    type: '0',
  },
  {
    chs: '[啤酒]',
    cht: '[啤酒]',
    eng: '[Beer]',
    gif: '',
    png: 'Expression_58.png',
    type: '0',
  },
  {
    chs: '[篮球]',
    cht: '[籃球]',
    eng: '[Basketball]',
    gif: '',
    png: 'Expression_59.png',
    type: '0',
  },
  {
    chs: '[乒乓]',
    cht: '[乒乓]',
    eng: '[PingPong]',
    gif: '',
    png: 'Expression_60.png',
    type: '0',
  },
  {
    chs: '[咖啡]',
    cht: '[咖啡]',
    eng: '[Coffee]',
    gif: '',
    png: 'Expression_61.png',
    type: '0',
  },
  {
    chs: '[饭]',
    cht: '[飯]',
    eng: '[Rice]',
    gif: '',
    png: 'Expression_62.png',
    type: '0',
  },
  {
    chs: '[猪头]',
    cht: '[豬頭]',
    eng: '[Pig]',
    gif: '',
    png: 'Expression_63.png',
    type: '0',
  },
  {
    chs: '[玫瑰]',
    cht: '[玫瑰]',
    eng: '[Rose]',
    gif: '',
    png: 'Expression_64.png',
    type: '0',
  },
  {
    chs: '[凋谢]',
    cht: '[枯萎]',
    eng: '[Wilt]',
    gif: '',
    png: 'Expression_65.png',
    type: '0',
  },
  {
    chs: '[嘴唇]',
    cht: '[嘴唇]',
    eng: '[Lips]',
    gif: '',
    png: 'Expression_66.png',
    type: '0',
  },
  {
    chs: '[爱心]',
    cht: '[愛心]',
    eng: '[Heart]',
    gif: '',
    png: 'Expression_67.png',
    type: '0',
  },
  {
    chs: '[心碎]',
    cht: '[心碎]',
    eng: '[BrokenHeart]',
    gif: '',
    png: 'Expression_68.png',
    type: '0',
  },
  {
    chs: '[蛋糕]',
    cht: '[蛋糕]',
    eng: '[Cake]',
    gif: '',
    png: 'Expression_69.png',
    type: '0',
  },
  {
    chs: '[闪电]',
    cht: '[閃電]',
    eng: '[Lightning]',
    gif: '',
    png: 'Expression_70.png',
    type: '0',
  },
  {
    chs: '[炸弹]',
    cht: '[炸彈]',
    eng: '[Bomb]',
    gif: '',
    png: 'Expression_71.png',
    type: '0',
  },
  {
    chs: '[刀]',
    cht: '[刀]',
    eng: '[Dagger]',
    gif: '',
    png: 'Expression_72.png',
    type: '0',
  },
  {
    chs: '[足球]',
    cht: '[足球]',
    eng: '[Soccer]',
    gif: '',
    png: 'Expression_73.png',
    type: '0',
  },
  {
    chs: '[瓢虫]',
    cht: '[甲蟲]',
    eng: '[Ladybug]',
    gif: '',
    png: 'Expression_74.png',
    type: '0',
  },
  {
    chs: '[便便]',
    cht: '[便便]',
    eng: '[Poop]',
    gif: '',
    png: 'Expression_75.png',
    type: '0',
  },
  {
    chs: '[月亮]',
    cht: '[月亮]',
    eng: '[Moon]',
    gif: '',
    png: 'Expression_76.png',
    type: '0',
  },
  {
    chs: '[太阳]',
    cht: '[太陽]',
    eng: '[Sun]',
    gif: '',
    png: 'Expression_77.png',
    type: '0',
  },
  {
    chs: '[礼物]',
    cht: '[禮物]',
    eng: '[Gift]',
    gif: '',
    png: 'Expression_78.png',
    type: '0',
  },
  {
    chs: '[拥抱]',
    cht: '[擁抱]',
    eng: '[Hug]',
    gif: '',
    png: 'Expression_79.png',
    type: '0',
  },
  {
    chs: '[强]',
    cht: '[強]',
    eng: '[ThumbsUp]',
    gif: '',
    png: 'Expression_80.png',
    type: '0',
  },
  {
    chs: '[弱]',
    cht: '[弱]',
    eng: '[ThumbsDown]',
    gif: '',
    png: 'Expression_81.png',
    type: '0',
  },
  {
    chs: '[握手]',
    cht: '[握手]',
    eng: '[Shake]',
    gif: '',
    png: 'Expression_82.png',
    type: '0',
  },
  {
    chs: '[胜利]',
    cht: '[勝利]',
    eng: '[Peace]',
    gif: '',
    png: 'Expression_83.png',
    type: '0',
  },
  {
    chs: '[抱拳]',
    cht: '[抱拳]',
    eng: '[Fight]',
    gif: '',
    png: 'Expression_84.png',
    type: '0',
  },
  {
    chs: '[勾引]',
    cht: '[勾引]',
    eng: '[Beckon]',
    gif: '',
    png: 'Expression_85.png',
    type: '0',
  },
  {
    chs: '[拳头]',
    cht: '[拳頭]',
    eng: '[Fist]',
    gif: '',
    png: 'Expression_86.png',
    type: '0',
  },
  {
    chs: '[差劲]',
    cht: '[差勁]',
    eng: '[Pinky]',
    gif: '',
    png: 'Expression_87.png',
    type: '0',
  },
  {
    chs: '[爱你]',
    cht: '[愛你]',
    eng: '[RockOn]',
    gif: '',
    png: 'Expression_88.png',
    type: '0',
  },
  {
    chs: '[NO]',
    cht: '[NO]',
    eng: '[Nuh-uh]',
    gif: '',
    png: 'Expression_89.png',
    type: '0',
  },
  {
    chs: '[OK]',
    cht: '[OK]',
    eng: '[OK]',
    gif: '',
    png: 'Expression_90.png',
    type: '0',
  },
  {
    chs: '[爱情]',
    cht: '[愛情]',
    eng: '[InLove]',
    gif: '',
    png: 'Expression_91.png',
    type: '0',
  },
  {
    chs: '[飞吻]',
    cht: '[飛吻]',
    eng: '[Blowkiss]',
    gif: '',
    png: 'Expression_92.png',
    type: '0',
  },
  {
    chs: '[跳跳]',
    cht: '[跳跳]',
    eng: '[Waddle]',
    gif: '',
    png: 'Expression_93.png',
    type: '0',
  },
  {
    chs: '[发抖]',
    cht: '[發抖]',
    eng: '[Tremble]',
    gif: '',
    png: 'Expression_94.png',
    type: '0',
  },
  {
    chs: '[怄火]',
    cht: '[噴火]',
    eng: '[Aaagh!]',
    gif: '',
    png: 'Expression_95.png',
    type: '0',
  },
  {
    chs: '[转圈]',
    cht: '[轉圈]',
    eng: '[Twirl]',
    gif: '',
    png: 'Expression_96.png',
    type: '0',
  },
  {
    chs: '[磕头]',
    cht: '[磕頭]',
    eng: '[Kotow]',
    gif: '',
    png: 'Expression_97.png',
    type: '0',
  },
  {
    chs: '[回头]',
    cht: '[回頭]',
    eng: '[Dramatic]',
    gif: '',
    png: 'Expression_98.png',
    type: '0',
  },
  {
    chs: '[跳绳]',
    cht: '[跳繩]',
    eng: '[JumpRope]',
    gif: '',
    png: 'Expression_99.png',
    type: '0',
  },
  {
    chs: '[投降]',
    cht: '[投降]',
    eng: '[Surrender]',
    gif: '',
    png: 'Expression_100.png',
    type: '0',
  },
];

export { wechatEmoji };
