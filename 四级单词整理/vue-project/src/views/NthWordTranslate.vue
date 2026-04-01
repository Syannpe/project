<script setup lang="ts">
import { sortedData } from "@/data";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { storageManager } from "@/utils/StorageManager";

const savedDay = sessionStorage.getItem("dayNum");
const currentDay = ref(savedDay && !Number.isNaN(+savedDay) ? +savedDay : 1);
sessionStorage.setItem("dayNum", String(currentDay.value));

const slicedData = ref(sortedData.slice((currentDay.value - 1) * 20, currentDay.value * 20));
const randomSlicedData = ref([...slicedData.value]);
const isShuffled = ref(false);
const storageType = ref('Unknown');

// 输入值存储
const inputValues = ref<Record<string, string>>({});
const saveTimers = new Map<string, ReturnType<typeof setTimeout>>();

// 加载已保存的值
const loadInputs = async () => {
  const schema = await storageManager.getSchema();
  const currentWords = isShuffled.value ? randomSlicedData.value : slicedData.value;

  // 重置并加载
  const values: Record<string, string> = {};
  for (const word of currentWords) {
    values[word.单词] = schema.wordInputs[word.单词] || '';
  }
  inputValues.value = values;
};

// 关键修复：直接传递值进行保存，避免闭包问题
const scheduleSave = (word: string, value: string) => {
  // 清除旧定时器
  const existingTimer = saveTimers.get(word);
  if (existingTimer) clearTimeout(existingTimer);

  // 设置新定时器
  const timer = setTimeout(async () => {
    console.log(`保存单词 ${word}: "${value}"`);
    const success = await storageManager.saveWordInput(word, value);
    console.log(`保存结果 ${word}:`, success ? '成功' : '失败');
    saveTimers.delete(word);
  }, 500);

  saveTimers.set(word, timer);
};

// 输入事件处理
const onInputChange = (word: string, value: string) => {
  // 先更新本地状态（用于显示）
  inputValues.value[word] = value;
  // 立即调度保存，传递当前值
  scheduleSave(word, value);
};

// 卸载前强制保存所有待保存的数据
onBeforeUnmount(() => {
  for (const [word, timer] of saveTimers.entries()) {
    clearTimeout(timer);
    const value = inputValues.value[word];
    console.log(`卸载前保存 ${word}: "${value}"`);
    // @ts-ignore

    storageManager.saveWordInput(word, value);
  }
  saveTimers.clear();
});

onMounted(async () => {
  storageType.value = await storageManager.init();
  await loadInputs();
});

// 洗牌逻辑
const shuffleData = () => {
  const shuffled = [...slicedData.value];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // @ts-ignore
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  randomSlicedData.value = shuffled;
};

const toggleShuffle = () => {
  isShuffled.value = !isShuffled.value;
  if (isShuffled.value) {
    shuffleData();
  } else {
    randomSlicedData.value = [...slicedData.value];
  }
  // 打乱或恢复后重新加载对应输入值
  loadInputs();
};

const displayData = computed(() => {
  return isShuffled.value ? randomSlicedData.value : slicedData.value;
});

const jumpTo = async (pageNum: number) => {
  currentDay.value = pageNum;
  sessionStorage.setItem("dayNum", String(pageNum));
  slicedData.value = sortedData.slice((pageNum - 1) * 20, pageNum * 20);
  isShuffled.value = false;
  randomSlicedData.value = [...slicedData.value];
  await loadInputs();
};
</script>

<template>
  <div class="controls">
    <button @click="toggleShuffle" :class="['shuffle-btn', { active: isShuffled }]">
      <span class="icon">{{ isShuffled ? '↺' : '🔀' }}</span>
      {{ isShuffled ? '恢复原序' : '打乱顺序' }}
    </button>
    <span class="hint">当前为{{ isShuffled ? '随机' : '原始' }}顺序</span>
    <span class="storage-hint">{{ storageType }}</span>
  </div>

  <p class="pagination">
    <a v-for="pageNum in Math.ceil(sortedData.length/20)" :key="pageNum"
       @click="jumpTo(pageNum)"
       :class="{ active: pageNum === currentDay }">
      {{ pageNum }}
    </a>
  </p>

  <table class="word-table">
    <thead>
    <tr>
      <td>单词</td>
      <td>音标</td>
      <td>考察次数</td>
      <td>汉译默写</td>
    </tr>
    </thead>
    <tbody>
    <tr v-for="word in displayData" :key="word.单词"
        :class="{ 'shuffled-row': isShuffled }">
      <td class="word-cell">{{ word.单词 }}</td>
      <td class="phonetic">{{ word.音标 }}</td>
      <td>
        <span class="count">{{ word.考察次数 }}</span>
      </td>
      <td>
        <!-- 关键修复：使用 :value + @input 代替 v-model，直接传递值 -->
        <input
            :value="inputValues[word.单词]"
            @input="e => onInputChange(word.单词, (e.target as HTMLInputElement).value)"
            :placeholder="`输入 ${word.单词} 的汉译...`"
            class="write-input" />
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.controls {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.shuffle-btn {
  padding: 10px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}
.shuffle-btn.active { background-color: #10b981; }
.hint { color: #6b7280; font-size: 13px; }
.storage-hint {
  color: #3b82f6;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
}
.pagination {
  text-align: center;
  margin: 20px 0;
}
.pagination a {
  font-size: 1.2em;
  margin: 0 6px;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-block;
  transition: all 0.2s;
}
.pagination a:hover { background-color: rgba(59, 130, 246, 0.1); }
.pagination a.active {
  background-color: #00bd7e;
  color: #000;
  font-weight: 600;
}
.word-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 15px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.word-table thead {
  background-color: #00bd7e;
  text-align: left;
  font-weight: 600;
}
.word-table td {
  padding: 14px 18px;
  border-bottom: 1px solid #e5e7eb;
}
.word-table tbody tr:last-child td { border-bottom: none; }
.shuffled-row { background-color: rgba(59, 130, 246, 0.03); }
.word-cell { font-weight: 600; color: #111827; font-size: 16px; }
.phonetic { color: #6b7280; font-style: italic; font-family: 'Times New Roman', serif; }
.count {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  background-color: rgba(0, 189, 126, 0.1);
  color: #00bd7e;
  font-size: 13px;
  font-weight: 600;
}
.write-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  background-color: white;
}
.write-input:focus {
  outline: none;
  border-color: #00bd7e;
  box-shadow: 0 0 0 3px rgba(0, 189, 126, 0.1);
}
</style>