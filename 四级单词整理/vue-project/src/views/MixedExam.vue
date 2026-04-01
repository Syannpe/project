<!-- src/views/MixedExam.vue -->
<script setup lang="ts">
import { sortedData } from "@/data";
import {ref, computed, onMounted, watch} from "vue";
import { storageManager } from "@/utils/StorageManager";

const totalPages = Math.ceil(sortedData.length / 20);
const selectedPages = ref<number[]>([]);
const examCount = ref(20);
const generatedWords = ref<any[]>([]);
const inputValues = ref<Record<string, string>>({});
const isGenerated = ref(false);
const difficultWords = ref<Set<string>>(new Set());
const storageType = ref('Unknown');

onMounted(async () => {
  storageType.value = await storageManager.init();
  const words = await storageManager.getDifficultWords();
  difficultWords.value = new Set(words);
});

// 切换页面选择
const togglePage = (pageNum: number) => {
  const index = selectedPages.value.indexOf(pageNum);
  if (index > -1) {
    selectedPages.value.splice(index, 1);
  } else {
    selectedPages.value.push(pageNum);
  }
};

// 生成混合试卷
const generateExam = () => {
  if (selectedPages.value.length === 0) {
    alert('请至少选择一个页面');
    return;
  }

  // 收集所有选中页面的单词
  let pool: any[] = [];
  selectedPages.value.forEach(pageNum => {
    const pageWords = sortedData.slice((pageNum - 1) * 20, pageNum * 20);
    pool = pool.concat(pageWords);
  });

  // 随机抽取指定数量
  const count = Math.min(examCount.value, pool.length);
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  generatedWords.value = shuffled.slice(0, count);
  isGenerated.value = true;

  // 加载这些单词的输入值
  loadInputs();
};

const loadInputs = async () => {
  const schema = await storageManager.getSchema();
  const values: Record<string, string> = {};
  for (const word of generatedWords.value) {
    values[word.单词] = schema.wordInputs[word.单词] || '';
  }
  inputValues.value = values;
};

// 保存输入
let saveTimeout: number | undefined;
watch(inputValues, (newVal) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    const schema = await storageManager.getSchema();
    for (const [word, value] of Object.entries(newVal)) {
      schema.wordInputs[word] = value;
    }
    await storageManager.saveSchema({ wordInputs: schema.wordInputs });
  }, 300);
}, { deep: true });

// 标记难单词
const toggleDifficult = async (word: string) => {
  if (difficultWords.value.has(word)) {
    await storageManager.removeDifficultWord(word);
    difficultWords.value.delete(word);
  } else {
    await storageManager.addDifficultWord(word);
    difficultWords.value.add(word);
  }
};

const isDifficult = (word: string) => difficultWords.value.has(word);

// 重新生成
const resetExam = () => {
  isGenerated.value = false;
  generatedWords.value = [];
};
</script>

<template>
  <div class="mixed-exam">
    <h2>🎲 混合考察模式</h2>

    <div v-if="!isGenerated" class="config-panel">
      <div class="section">
        <h3>选择考察范围（多选）</h3>
        <div class="page-selector">
          <button v-for="page in totalPages" :key="page"
                  @click="togglePage(page)"
                  :class="['page-btn', { selected: selectedPages.includes(page) }]">
            第{{ page }}页
          </button>
        </div>
        <p class="hint" v-if="selectedPages.length > 0">
          已选择 {{ selectedPages.length }} 个页面，共 {{ selectedPages.length * 20 }} 个单词
        </p>
      </div>

      <div class="section">
        <h3>设置考察数量</h3>
        <div class="count-setting">
          <input type="number" v-model.number="examCount" min="1" max="100" class="number-input" />
          <span class="unit">个单词</span>
        </div>
      </div>

      <button @click="generateExam" class="generate-btn" :disabled="selectedPages.length === 0">
        生成考察试卷
      </button>
    </div>

    <div v-else class="exam-panel">
      <div class="exam-header">
        <p>从第 {{ selectedPages.join('、') }} 页随机抽取 {{ generatedWords.length }} 个单词</p>
        <button @click="resetExam" class="reset-btn">重新选择</button>
      </div>

      <table class="word-table">
        <thead>
        <tr>
          <td>单词</td>
          <td>音标</td>
          <td>考察次数</td>
          <td>来源页</td>
          <td>汉译默写</td>
          <td>难单词</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="word in generatedWords" :key="word.单词"
            :class="{ 'difficult-row': isDifficult(word.单词) }">
          <td class="word-cell">{{ word.单词 }}</td>
          <td class="phonetic">{{ word.音标 }}</td>
          <td>
            <span class="count">{{ word.考察次数 }}</span>
          </td>
          <td>
            <span class="page-tag">第{{ Math.floor(sortedData.indexOf(word) / 20) + 1 }}页</span>
          </td>
          <td>
            <input v-model="inputValues[word.单词]"
                   placeholder="输入汉译..."
                   class="write-input" />
          </td>
          <td class="difficult-cell">
            <label class="star-checkbox" :class="{ active: isDifficult(word.单词) }">
              <input type="checkbox" :checked="isDifficult(word.单词)"
                     @change="toggleDifficult(word.单词)" />
              <span class="star">★</span>
            </label>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.mixed-exam {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #111827;
}

.config-panel {
  background: #f9fafb;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  font-size: 16px;
  color: #374151;
  margin-bottom: 16px;
}

.page-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.page-btn {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.page-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.page-btn.selected {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.count-setting {
  display: flex;
  align-items: center;
  gap: 12px;
}

.number-input {
  width: 100px;
  padding: 10px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  text-align: center;
}

.unit {
  color: #6b7280;
}

.hint {
  color: #6b7280;
  font-size: 14px;
  margin-top: 12px;
}

.generate-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #eff6ff;
  border-radius: 8px;
  color: #1e40af;
}

.reset-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  border-radius: 6px;
  cursor: pointer;
}

.word-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.word-table thead {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-weight: 600;
}

.word-table td {
  padding: 14px 18px;
}

.difficult-row {
  background-color: rgba(239, 68, 68, 0.05);
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
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-size: 13px;
  font-weight: 600;
}

.page-tag {
  display: inline-block;
  padding: 4px 8px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 4px;
  font-size: 12px;
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
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.difficult-cell {
  text-align: center;
}

.star-checkbox {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  position: relative;
}

.star-checkbox input {
  position: absolute;
  opacity: 0;
}

.star {
  font-size: 20px;
  color: #d1d5db;
  transition: all 0.2s;
}

.star-checkbox.active .star {
  color: #ef4444;
  transform: scale(1.1);
}
</style>