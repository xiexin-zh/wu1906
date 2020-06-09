/**
 *
 * @param {string} text 需要匹配替换的原始字符串
 * @param {*} memberMap 存储用户信息的 map
 * @param {*} robotMap 存储机器人信息的 map
 *
 * @return {string} 匹配替换后的新字符串
 */
export function messageIdToName(text, memberMap, robotMap) {
  let textArr = (text || '').split(/(@<==[\w]+=>|@{==[\w]+=})/);
  // console.log(textArr)
  let newTextArr = textArr.map((item) => {
    let replace = item.match(/@<=(=[\w]+)=>/);
    if (replace && memberMap && memberMap[replace[1]]) {
      let member = memberMap[replace[1]];
      let replacetext =
        member.nickname || member.given_name || member.full_name || member.name;
      return replace.input.replace('@<=' + member.id + '=>', '@' + replacetext);
    }
    replace = item.match(/@{=(=[\w]+)=}/);
    if (replace && robotMap && robotMap[replace[1]]) {
      let robot = robotMap[replace[1]];
      return replace.input.replace('@{=' + robot.id + '=}', '@' + robot.name);
    }
    return item;
  });
  return newTextArr.join('');
}

/**
 * 用正则将文本消息 text 转换为各种类型数据的数组
 */
export function msgToArr(txt) {
  let text = txt;
  if (typeof text === 'number') {
    text += '';
  } else if (typeof text !== 'string') {
    text = '';
  }
  // 完成匹配，可以结束循环
  let finish = false;
  // 匹配到的项
  let pattArr = [];
  // 目标数组
  let resultArr = [];
  // 存储匹配结果，result 的 index 为 key 用于判断之前是否匹配到此数据
  let startMap = {};
  // @机器人
  // const robotPatt = RegExp(/@{=(=[\w]+)=}/g);
  // @人匹配正则
  // const mentionPatt = RegExp(/@<=(=[\w]+)=>/g);
  // @所有人
  // const mentionAllPatt = RegExp(/@<-channel->/g);
  // 表情匹配正则
  // const emojiPatt = RegExp(/(:[\w_\+\-]+:)/g);
  // 微信表情（默认）匹配正则
  const wechatPatt = RegExp(/(\[[^\]\[\s\d]+\])(?!\(([^\(\)]+)\))/g);
  // markdown 的 link 类型匹配正则
  // const mdLink = RegExp(/\[([^\[\]]+)\]\(([^\(\)]+)\)/g);
  const mdLink = RegExp(
    /\[([^\[\]]+)\]\(((assistant|rollsmary|crm|user|http|https|css):\/\/[^\(\)]+)\)/g
  );

  // MD link css
  // const cssText = RegExp(/^css:\/\/text\?(&?(sp_text_color=#[0-9a-fA-F]{3,6}|sp_text_style=bold)){1,2}$/);
  const cssText = RegExp(/^css:\/\/text\?\S+$/);
  // 链接，需放在 markdown 后面
  // const linkPatt = RegExp(/https?:\/\/\S*/g);
  // 邮箱
  // let mailPatt = RegExp(/[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}/);

  let result;
  let markdownResults = [];

  while (((result = mdLink.exec(text)), result)) {
    const protocol = result[3];
    if (protocol === 'css' && !cssText.test(result[2])) {
      continue;
    }
    if (isNewResult(result.index, result.index + result[0].length)) {
      const resultItem = {
        start: result.index,
        end: result.index + result[0].length,
        type: 'link',
        data: {
          text: result[1],
          url: result[2],
          protocol,
        },
        text: result[0],
      };
      startMap[result.index] = resultItem;
      markdownResults.push({
        start: result.index,
        end: result.index + result[0].length,
      });
      pattArr.push(resultItem);
    }
  }
  function isNewResult(start, end) {
    if (startMap[result.index]) {
      return false;
    }
    for (let index = 0; index < markdownResults.length; index++) {
      const item = markdownResults[index];
      if (start >= item.start && start < item.end) {
        return false;
      }
      if (end > item.start && end <= item.end) {
        return false;
      }
    }
    return true;
  }
  while (!finish) {
    let hasMatch = false;
    // if (result = mentionPatt.exec(text), result) {
    //   // 新匹配到到内容添加到数组和对象中
    //   if (isNewResult(result.index, result.index + result[0].length)) {
    //     const resultItem = {
    //       start: result.index,
    //       end: result.index + result[0].length,
    //       type: 'mention',
    //       data: result[1],
    //       text: result[0]
    //     }
    //     hasMatch = true;
    //     startMap[result.index] = resultItem;
    //     pattArr.push(resultItem)
    //   }
    // }
    // if (result = mentionAllPatt.exec(text), result) {
    //   if (isNewResult(result.index, result.index + result[0].length)) {
    //     const resultItem = {
    //       start: result.index,
    //       end: result.index + result[0].length,
    //       type: 'mention',
    //       data: 'channel',
    //       text: result[0]
    //     }
    //     hasMatch = true;
    //     startMap[result.index] = resultItem;
    //     pattArr.push(resultItem)
    //   }
    // }
    // if (result = robotPatt.exec(text), result) {
    //   if (isNewResult(result.index, result.index + result[0].length)) {
    //     const resultItem = {
    //       start: result.index,
    //       end: result.index + result[0].length,
    //       type: 'robot',
    //       data: result[1],
    //       text: result[0]
    //     }
    //     hasMatch = true;
    //     startMap[result.index] = resultItem;
    //     pattArr.push(resultItem)
    //   }
    // }
    // if (result = emojiPatt.exec(text), result) {
    //   if (isNewResult(result.index, result.index + result[0].length)) {
    //     const resultItem = {
    //       start: result.index,
    //       end: result.index + result[0].length,
    //       type: 'emoji',
    //       data: result[1],
    //       text: result[0]
    //     }
    //     hasMatch = true;
    //     startMap[result.index] = resultItem;
    //     pattArr.push(resultItem)
    //   }
    // }
    if (((result = wechatPatt.exec(text)), result)) {
      if (isNewResult(result.index, result.index + result[0].length)) {
        const resultItem = {
          start: result.index,
          end: result.index + result[0].length,
          type: 'wechat',
          data: result[1],
          text: result[0],
        };
        hasMatch = true;
        startMap[result.index] = resultItem;
        pattArr.push(resultItem);
      }
    }
    // if (result = linkPatt.exec(text), result) {
    //   if (isNewResult(result.index, result.index + result[0].length)) {
    //     const resultItem = {
    //       start: result.index,
    //       end: result.index + result[0].length,
    //       type: 'link',
    //       data: {
    //         text: result[0],
    //         url: result[0],
    //         protocol: 'https'
    //       },
    //       text: result[0]
    //     }
    //     hasMatch = true;
    //     startMap[result.index] = resultItem;
    //     pattArr.push(resultItem)
    //   }
    // }
    if (!hasMatch) {
      // 如果一次循环中无任何一个内容匹配到，判断匹配结束
      finish = true;
    }
  }
  // 无匹配项，返回整个文本
  if (pattArr.length === 0) {
    return [
      {
        start: 0,
        end: text.length,
        type: 'normal',
        text: text,
      },
    ];
  }
  // 根据开始位置排序匹配项
  pattArr.sort((a, b) => a.start - b.start);

  // 循环匹配项，在匹配项的中间补上其他未匹配到到普通文本，结果放于 resultArr
  pattArr.forEach((item, index) => {
    // 第一匹配项前还有文本
    if (index === 0 && item.start !== 0) {
      resultArr.push({
        start: 0,
        end: item.start,
        type: 'normal',
        text: text.slice(0, item.start),
      });
    }
    resultArr.push(item);
    // 此匹配项和后一匹配项中间有文本
    if (index < pattArr.length - 1 && item.end !== pattArr[index + 1].start) {
      resultArr.push({
        start: item.end,
        end: pattArr[index + 1].start,
        type: 'normal',
        text: text.slice(item.end, pattArr[index + 1].start),
      });
    }
    // 最后一个匹配项后还有文本
    if (index === pattArr.length - 1 && item.end !== text.length) {
      resultArr.push({
        start: item.end,
        end: text.length,
        type: 'normal',
        text: text.slice(item.end),
      });
    }
  });
  return resultArr;
}

// export function promptTone() {
//   var audioCtx = new AudioContext();
//   var start = 0, direction = 1;

//     // 发出的声音频率数据，表现为音调的高低
//     var arrFrequency = [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
//     var frequency = arrFrequency[start];
//     // 创建一个OscillatorNode, 它表示一个周期性波形（振荡），基本上来说创造了一个音调
//     var oscillator = audioCtx.createOscillator();
//     // 创建一个GainNode,它可以控制音频的总音量
//     var gainNode = audioCtx.createGain();
//     // 把音量，音调和终节点进行关联
//     oscillator.connect(gainNode);
//     // audioCtx.destination返回AudioDestinationNode对象，表示当前audio context中所有节点的最终节点，一般表示音频渲染设备
//     gainNode.connect(audioCtx.destination);
//     // 指定音调的类型，其他还有square|triangle|sawtooth
//     oscillator.type = 'sine';
//     // 设置当前播放声音的频率，也就是最终播放声音的调调
//     oscillator.frequency.value = frequency;
//     // 当前时间设置音量为0
//     gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
//     // 0.01秒后音量为1
//     gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
//     // 音调从当前时间开始播放
//     oscillator.start(audioCtx.currentTime);
//     // 1秒内声音慢慢降低，是个不错的停止声音的方法
//     gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
//     // 1秒后完全停止声音
//     oscillator.stop(audioCtx.currentTime + 1);
// }
