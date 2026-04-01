<!-- src/views/DifficultWords.vue -->
<script setup lang="ts">
import { sortedData } from "@/data";
import {ref, computed, onMounted, watch} from "vue";
import { storageManager } from "@/utils/StorageManager";

// 获取所有难单词数据
const difficultWordList = ref<string[]>([]);
const inputValues = ref<Record<string, string>>({});
const isShuffled = ref(false);
const randomData = ref<any[]>([]);
const storageType = ref('Unknown');

// 从完整数据中筛选出难单词
const difficultWordsData = computed(() => {
  return sortedData.filter(item => difficultWordList.value.includes(item.单词));
});

const displayData = computed(() => {
  return isShuffled.value ? randomData.value : difficultWordsData.value;
});

onMounted(async () => {
  storageType.value = await storageManager.init();
  await loadDifficultWords();
});

const loadDifficultWords = async () => {
  difficultWordList.value = await storageManager.getDifficultWords();
  // 加载输入值
  const schema = await storageManager.getSchema();
  const values: Record<string, string> = {};
  for (const word of difficultWordList.value) {
    values[word] = schema.wordInputs[word] || '';
  }
  inputValues.value = values;
};

// 保存输入
let saveTimeout: number | undefined;
watch(inputValues, (newVal) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    const schema = await storageManager.getSchema();
    schema.wordInputs = { ...schema.wordInputs, ...newVal };
    await storageManager.saveSchema({ wordInputs: schema.wordInputs });
  }, 300);
}, { deep: true });

// 随机打乱
const shuffleData = () => {
  const shuffled = [...difficultWordsData.value];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // @ts-ignore
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  randomData.value = shuffled;
};

const toggleShuffle = () => {
  isShuffled.value = !isShuffled.value;
  if (isShuffled.value) {
    shuffleData();
  }
};

// 移除难单词
const removeDifficult = async (word: string) => {
  if (confirm(`确定将 "${word}" 从难单词列表移除吗？`)) {
    await storageManager.removeDifficultWord(word);
    await loadDifficultWords();
  }
};

// 导出功能
const exportDifficultWords = async () => {
  const words = await storageManager.getDifficultWords();
  const data = {
    exportDate: new Date().toISOString(),
    words: words,
    inputs: inputValues.value
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `difficult-words-special-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <div class="page-header">
    <h2>🎯 难单词专项过关</h2>
    <p class="subtitle">共 {{ difficultWordsData.length }} 个难单词，坚持就是胜利！</p>
  </div>

  <div class="controls" v-if="difficultWordsData.length > 0">
    <button @click="toggleShuffle" :class="['shuffle-btn', { active: isShuffled }]">
      <span class="icon">{{ isShuffled ? '↺' : '🔀' }}</span>
      {{ isShuffled ? '恢复原序' : '随机顺序' }}
    </button>
    <button @click="exportDifficultWords" class="export-btn">
      导出难单词与进度
    </button>
    <span class="storage-tag">存储: {{ storageType }}</span>
  </div>

  <div v-if="difficultWordsData.length === 0" class="empty-state">
    <div class="empty-icon">📚</div>
    <p>还没有标记难单词哦</p>
    <p class="empty-hint">在"第n天要背的单词"页面标记★后，会出现在这里</p>
  </div>

  <table v-else class="word-table">
    <thead>
    <tr>
      <td>单词</td>
      <td>音标</td>
      <td>考察次数</td>
      <td>汉译默写（输入）</td>
      <td>操作</td>
    </tr>
    </thead>
    <tbody>
    <tr v-for="word in displayData" :key="word.单词">
      <td class="word-cell">{{ word.单词 }}</td>
      <td class="phonetic">{{ word.音标 }}</td>
      <td>
        <span class="count">{{ word.考察次数 }}</span>
      </td>
      <td>
        <input v-model="inputValues[word.单词]"
               placeholder="输入汉译..."
               class="write-input" />
      </td>
      <td>
        <button @click="removeDifficult(word.单词)" class="remove-btn" title="移除难单词">
          ✕
        </button>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.page-header {
  text-align: center;
  margin: 30px 0;
}

.page-header h2 {
  font-size: 24px;
  color: #111827;
  margin-bottom: 8px;
}

.subtitle {
  color: #6b7280;
  font-size: 14px;
}

.controls {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.shuffle-btn, .export-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.shuffle-btn {
  background-color: #3b82f6;
  color: white;
}

.shuffle-btn.active {
  background-color: #10b981;
}

.export-btn {
  background-color: #8b5cf6;
  color: white;
}

.storage-tag {
  padding: 6px 12px;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-hint {
  font-size: 14px;
  margin-top: 8px;
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
  background-color: #ef4444;
  color: white;
  text-align: left;
  font-weight: 600;
}

.word-table td {
  padding: 14px 18px;
}

.word-cell {
  font-weight: 600;
}

.phonetic {
  color: #6b7280;
  font-style: italic;
}

.count {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
}

.write-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}

.write-input:focus {
  outline: none;
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.remove-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: #fee2e2;
  color: #ef4444;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-btn:hover {
  background-color: #ef4444;
  color: white;
  transform: scale(1.1);
}
</style>