<script setup lang="ts">
import { sortedData } from "@/data";
import { ref, computed, onMounted, watch } from "vue";
import { storageManager } from "@/utils/StorageManager";

// ==============================================
// 天数逻辑：无记录时默认为1，不再弹窗询问
// ==============================================
const savedDay = sessionStorage.getItem("dayNum");
const currentPage = ref(savedDay && !Number.isNaN(+savedDay) ? +savedDay : 1);

// 确保sessionStorage同步
sessionStorage.setItem("dayNum", String(currentPage.value));

const slicedData = ref(sortedData.slice((currentPage.value - 1) * 20, currentPage.value * 20));
const hiddenTranslations = ref<Set<number>>(new Set());
const isShuffled = ref(false);
const randomSlicedData = ref([...slicedData.value]);

// 难单词和打卡状态
const difficultWords = ref<Set<string>>(new Set());
const checkInStatus = ref<{
  todayChecked: boolean;
  daysSince: number;
  isDue: boolean;
  dueNode: number | null;
  totalCheckIns: number;
}>({
  todayChecked: false,
  daysSince: -1,
  isDue: false,
  dueNode: null,
  totalCheckIns: 0
});
const storageType = ref('Unknown');
const allDuePages = ref<Array<{pageNum: number; daysSince: number; dueNode: number | null}>>([]);

// ==============================================
// 初始化
// ==============================================
onMounted(async () => {
  storageType.value = await storageManager.init();
  await loadDifficultWords();
  await loadCheckInStatus();
  await loadAllDuePages(); // 加载所有需要复习的页面

  watch(slicedData, (val) => {
    if (isShuffled.value) {
      shuffleData();
    } else {
      randomSlicedData.value = [...val];
    }
  }, { immediate: true });
});

// ==============================================
// 页面打卡功能（核心修正）
// ==============================================
const loadCheckInStatus = async () => {
  const status = await storageManager.getPageReviewStatus(currentPage.value);
  const records = await storageManager.getPageCheckIns(currentPage.value);

  // 检查今天是否已打卡
  const today = new Date().toISOString().split('T')[0];
  const todayChecked = records.some(r => r.date === today);

  checkInStatus.value = {
    todayChecked,
    daysSince: status.daysSince,
    isDue: status.isDue,
    dueNode: status.dueNode,
    totalCheckIns: records.length
  };
};

const loadAllDuePages = async () => {
  allDuePages.value = await storageManager.getAllDuePages();
};

const handlePageCheckIn = async () => {
  if (checkInStatus.value.todayChecked) {
    if (!confirm('今日已打卡，确定要重新打卡吗？')) {
      return;
    }
  }

  const success = await storageManager.checkInPage(currentPage.value);
  if (success) {
    alert(`✅ 第 ${currentPage.value} 页打卡成功！`);
    await loadCheckInStatus();
    await loadAllDuePages(); // 刷新复习列表
  } else {
    alert('今日已打卡，请勿重复操作');
  }
};

// 获取艾宾浩斯提示文本
const getReviewText = () => {
  const { daysSince, isDue, dueNode, todayChecked } = checkInStatus.value;

  if (todayChecked) return { text: '今日已打卡 ✓', type: 'success', color: '#10b981' };
  if (daysSince === -1) return { text: '未开始打卡', type: 'new', color: '#6b7280' };
  if (isDue && dueNode) {
    if (dueNode === 1) return { text: '🔥 第1天复习', type: 'due', color: '#ef4444' };
    if (dueNode === 2) return { text: '📌 第2天复习', type: 'due', color: '#f97316' };
    if (dueNode === 5) return { text: '⏰ 第5天复习', type: 'due', color: '#eab308' };
    if (dueNode === 10) return { text: '📅 第10天复习', type: 'due', color: '#8b5cf6' };
    return { text: `⚠️ ${dueNode}天未复习`, type: 'overdue', color: '#dc2626' };
  }
  return { text: `${daysSince}天前打卡`, type: 'normal', color: '#6b7280' };
};

// ==============================================
// 难单词功能（保持不变）
// ==============================================
const loadDifficultWords = async () => {
  const words = await storageManager.getDifficultWords();
  difficultWords.value = new Set(words);
};

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
const currentPageDifficultCount = computed(() =>
    slicedData.value.filter(w => difficultWords.value.has(w.单词)).length
);

// ==============================================
// 随机顺序功能
// ==============================================
const shuffleData = () => {
  const shuffled = [...slicedData.value];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  randomSlicedData.value = shuffled;
};

const toggleShuffle = () => {
  isShuffled.value = !isShuffled.value;
  if (isShuffled.value) shuffleData();
  else randomSlicedData.value = [...slicedData.value];
};

const displayData = computed(() =>
    isShuffled.value ? randomSlicedData.value : slicedData.value
);

// ==============================================
// 页面切换（切换时重新加载打卡状态）
// ==============================================
const jumpTo = async (pageNum: number) => {
  slicedData.value = sortedData.slice((pageNum - 1) * 20, pageNum * 20);
  currentPage.value = pageNum;
  sessionStorage.setItem("dayNum", String(pageNum));
  hiddenTranslations.value.clear();
  isShuffled.value = false;
  randomSlicedData.value = [...slicedData.value];

  // 重新加载新页面的打卡状态
  await loadCheckInStatus();
};

// 检查某页是否需要复习（用于分页导航标注）
const isPageDue = (pageNum: number) => {
  return allDuePages.value.some(p => p.pageNum === pageNum);
};

const getPageDueClass = (pageNum: number) => {
  const page = allDuePages.value.find(p => p.pageNum === pageNum);
  if (!page) return '';
  if (page.dueNode === 1) return 'due-1';
  if (page.dueNode === 2) return 'due-2';
  if (page.dueNode === 5) return 'due-5';
  if (page.dueNode === 10) return 'due-10';
  return 'overdue';
};

// ==============================================
// 汉译遮挡功能（保持不变）
// ==============================================
const toggleTranslation = (index: number) => {
  const newSet = new Set(hiddenTranslations.value);
  if (newSet.has(index)) newSet.delete(index);
  else newSet.add(index);
  hiddenTranslations.value = newSet;
};

const isAllHidden = computed(() =>
    displayData.value.length > 0 && hiddenTranslations.value.size === displayData.value.length
);

const toggleAll = () => {
  if (isAllHidden.value) hiddenTranslations.value.clear();
  else hiddenTranslations.value = new Set(displayData.value.map((_, i) => i));
};

// ==============================================
// 导出导入（保持不变）
// ==============================================
const exportDifficultWords = async () => {
  const words = await storageManager.getDifficultWords();
  const data = {
    exportDate: new Date().toISOString(),
    storageMode: storageType.value,
    totalCount: words.length,
    words: words
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `difficult-words-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const importInputRef = ref<HTMLInputElement | null>(null);
const triggerImport = () => importInputRef.value?.click();

const importDifficultWords = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const content = e.target?.result as string;
      const data = JSON.parse(content);
      let importedWords: string[] = [];
      if (Array.isArray(data)) importedWords = data;
      else if (data.words && Array.isArray(data.words)) importedWords = data.words;
      else throw new Error('格式错误');

      for (const word of importedWords) {
        await storageManager.addDifficultWord(word);
      }
      await loadDifficultWords();
      alert(`成功导入 ${importedWords.length} 个难单词`);
    } catch (err) {
      alert('导入失败：文件格式不正确');
    }
    (event.target as HTMLInputElement).value = '';
  };
  reader.readAsText(file);
};
</script>

<template>
  <!-- 存储状态指示器 -->
  <div class="storage-status" :class="storageType.toLowerCase()">
    <div class="status-content">
      <span class="status-icon">
        {{ storageType === 'IndexedDB' ? '🗄️' : storageType === 'WebStorage' ? '💾' :
          storageType === 'Cookie' ? '🍪' : '⚠️' }}
      </span>
      <span class="status-text">
        当前存储方式：<strong>{{ storageType }}</strong>
      </span>
    </div>
  </div>

  <!-- 页面级打卡控制栏（核心修正） -->
  <div class="page-checkin-bar">
    <div class="checkin-info">
      <span class="page-label">第 {{ currentPage }} 页</span>
      <span class="review-badge" :style="{ color: getReviewText().color }">
        {{ getReviewText().text }}
      </span>
      <span v-if="checkInStatus.totalCheckIns > 0" class="total-count">
        累计打卡 {{ checkInStatus.totalCheckIns }} 次
      </span>
    </div>

    <button
        @click="handlePageCheckIn"
        class="checkin-btn"
        :class="{ 'checked': checkInStatus.todayChecked }"
    >
      {{ checkInStatus.todayChecked ? '今日已打卡 ✓' : '打卡签到 📌' }}
    </button>
  </div>

  <!-- 需要复习的页面提示 -->
  <div v-if="allDuePages.length > 0" class="due-pages-hint">
    <strong>📚 待复习页面：</strong>
    <span
        v-for="page in allDuePages.slice(0, 5)"
        :key="page.pageNum"
        :class="['due-tag', getPageDueClass(page.pageNum)]"
        @click="jumpTo(page.pageNum)"
        title="点击跳转"
    >
      第{{ page.pageNum }}页
      <small v-if="page.dueNode && page.dueNode <= 10">(D{{ page.dueNode }})</small>
      <small v-else>({{ page.daysSince }}天)</small>
    </span>
    <span v-if="allDuePages.length > 5" class="more-hint">+{{ allDuePages.length - 5 }}个</span>
  </div>

  <div class="controls">
    <div class="control-group">
      <button @click="toggleAll" class="toggle-all-btn">
        {{ isAllHidden ? '全部取消' : '全部遮挡' }}
      </button>
      <button @click="toggleShuffle" :class="['shuffle-btn', { active: isShuffled }]">
        <span class="icon">{{ isShuffled ? '↺' : '🔀' }}</span>
        {{ isShuffled ? '恢复原序' : '打乱顺序' }}
      </button>
      <span class="hint">点击汉译单元格可单独切换遮挡</span>
    </div>

    <div class="control-group difficult-controls">
      <button @click="exportDifficultWords" class="export-btn" :disabled="difficultWords.size === 0">
        导出难单词 ({{ difficultWords.size }})
      </button>
      <button @click="triggerImport" class="import-btn">导入难单词</button>
      <input ref="importInputRef" type="file" accept=".json" style="display: none" @change="importDifficultWords" />
      <span class="hint" v-if="currentPageDifficultCount > 0">本页已标记 {{ currentPageDifficultCount }} 个</span>
    </div>
  </div>

  <!-- 分页导航（带复习标记） -->
  <p class="pagination">
    <a
        v-for="pageNum in Math.ceil(sortedData.length/20)"
        :key="pageNum"
        @click="jumpTo(pageNum)"
        :class="{
        active: pageNum === currentPage,
        'is-due': isPageDue(pageNum),
        [getPageDueClass(pageNum)]: isPageDue(pageNum)
      }">
      {{ pageNum }}
    </a>
  </p>

  <table class="word-table">
    <thead>
    <tr>
      <td>单词</td>
      <td>汉译（点击切换）</td>
      <td>音标</td>
      <td>考察次数</td>
      <td class="difficult-header">难单词</td>
    </tr>
    </thead>
    <tbody>
    <tr
        v-for="(word, index) in displayData"
        :key="word.单词"
        :class="{ 'difficult-row': isDifficult(word.单词) }">
      <td class="word-cell">{{ word.单词 }}</td>
      <td
          @click="toggleTranslation(index)"
          :class="{ 'hidden-translation': hiddenTranslations.has(index) }"
          class="translation-cell">
        <span class="text-content">{{ word.汉译 }}</span>
        <span v-if="hiddenTranslations.has(index)" class="reveal-hint">点击显示</span>
      </td>
      <td class="phonetic">{{ word.音标 }}</td>
      <td>
        <span class="count">{{ word.考察次数 }}</span>
      </td>
      <td class="difficult-cell">
        <label class="star-checkbox" :class="{ active: isDifficult(word.单词) }">
          <input type="checkbox" :checked="isDifficult(word.单词)" @change="toggleDifficult(word.单词)" />
          <span class="star">★</span>
        </label>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
/* 页面打卡栏 */
.page-checkin-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  border-radius: 12px;
  margin: 20px 0;
  border: 2px solid #bbf7d0;
}

.checkin-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-label {
  font-size: 18px;
  font-weight: 700;
  color: #15803d;
}

.review-badge {
  padding: 4px 12px;
  background: rgba(255,255,255,0.8);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.total-count {
  color: #6b7280;
  font-size: 13px;
}

.checkin-btn {
  padding: 10px 28px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.checkin-btn:hover:not(.checked) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
}

.checkin-btn.checked {
  background: #9ca3af;
  cursor: default;
  box-shadow: none;
}

/* 待复习页面提示栏 */
.due-pages-hint {
  margin: -10px 0 20px;
  padding: 12px 16px;
  background: #fef3c7;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.due-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.due-tag:hover {
  transform: translateY(-1px);
}

.due-tag.due-1 { background: #fee2e2; color: #dc2626; }
.due-tag.due-2 { background: #ffedd5; color: #ea580c; }
.due-tag.due-5 { background: #fef3c7; color: #a16207; }
.due-tag.due-10 { background: #f3e8ff; color: #7c3aed; }
.due-tag.overdue { background: #fecaca; color: #991b1b; }

.more-hint {
  color: #9ca3af;
  font-size: 12px;
}

/* 分页导航复习标记 */
.pagination {
  text-align: center;
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.pagination a {
  font-size: 1.1em;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s;
  display: inline-block;
  cursor: pointer;
  min-width: 36px;
  text-align: center;
  border: 2px solid transparent;
}

.pagination a:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.pagination a.active {
  background-color: #00bd7e;
  color: #000;
  font-weight: 600;
  border-color: #00bd7e;
}

/* 复习提醒颜色标记 */
.pagination a.is-due {
  position: relative;
  font-weight: 600;
}

.pagination a.due-1 {
  background-color: #fee2e2;
  color: #dc2626;
  border-color: #ef4444;
  animation: pulse 2s infinite;
}
.pagination a.due-2 {
  background-color: #ffedd5;
  color: #ea580c;
  border-color: #f97316;
}
.pagination a.due-5 {
  background-color: #fef3c7;
  color: #a16207;
  border-color: #eab308;
}
.pagination a.due-10 {
  background-color: #f3e8ff;
  color: #7c3aed;
  border-color: #8b5cf6;
}
.pagination a.overdue {
  background-color: #fecaca;
  color: #991b1b;
  border-color: #dc2626;
  text-decoration: line-through;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 其余样式保持不变... */
.storage-status {
  position: relative;
  top: 0;
  z-index: 100;
  padding: 12px 20px;
  margin: -20px -20px 20px -20px;
  background: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
  font-size: 14px;
}

.controls {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-all-btn, .shuffle-btn, .export-btn, .import-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-all-btn { background-color: #00bd7e; color: #000; }
.shuffle-btn { background-color: #3b82f6; color: white; }
.shuffle-btn.active { background-color: #10b981; }
.export-btn { background-color: #ef4444; color: white; }
.import-btn { background-color: #3b82f6; color: white; }

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
  font-weight: 600;
}

.word-table td {
  padding: 14px 18px;
}

.difficult-row {
  background-color: rgba(239, 68, 68, 0.08) !important;
}

.translation-cell {
  cursor: pointer;
  position: relative;
  min-width: 120px;
}

.hidden-translation {
  background-color: #1f2937;
  border-radius: 6px;
  user-select: none;
}

.hidden-translation .text-content {
  opacity: 0;
  filter: blur(8px);
}

.reveal-hint {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #6b7280;
  font-size: 12px;
}

.word-cell { font-weight: 600; }
.phonetic { color: #6b7280; font-style: italic; }

.count {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  background-color: rgba(0, 189, 126, 0.1);
  color: #00bd7e;
  font-size: 13px;
  font-weight: 600;
}

.difficult-header { text-align: center; width: 100px; }
.difficult-cell { text-align: center; }

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