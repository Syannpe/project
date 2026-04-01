<!-- src/views/WordBook.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { sortedData } from '@/data';
import { storageManager } from '@/utils/StorageManager';
import type { WordBookEntry } from '@/types/storage';

// 状态
const searchWord = ref('');
const isChecking = ref(false);
const checkResult = ref<{
  exists: boolean;
  inSystem: boolean;
  inWordBook: boolean;
  data?: any;
  message: string;
} | null>(null);

const newEntry = ref({
  word: '',
  phonetic: '',
  translation: ''
});

const wordBookList = ref<WordBookEntry[]>([]);
const storageType = ref('Unknown');
const isLoading = ref(false);

// 编辑模式
const editingWord = ref<string | null>(null);
const editForm = ref({
  phonetic: '',
  translation: ''
});

// 初始化
onMounted(async () => {
  storageType.value = await storageManager.init();
  await loadWordBook();
});

const loadWordBook = async () => {
  isLoading.value = true;
  wordBookList.value = await storageManager.getWordBook();
  isLoading.value = false;
};

// 检查单词是否存在
const checkWord = () => {
  const word = searchWord.value.trim();
  if (!word) {
    alert('请输入单词');
    return;
  }

  isChecking.value = true;

  // 检查原始四级词库
  const inSystemData = sortedData.find(w => w.单词.toLowerCase() === word.toLowerCase());
  const inSystem = !!inSystemData;

  // 检查单词本
  const inWordBookData = wordBookList.value.find(w => w.word.toLowerCase() === word.toLowerCase());
  const inWordBook = !!inWordBookData;

  if (inSystemData) {
    // 存在于系统词库
    checkResult.value = {
      exists: true,
      inSystem: true,
      inWordBook: false,
      data: inSystemData,
      message: `单词 "${word}" 已存在于四级词库中（第${Math.floor(sortedData.indexOf(inSystemData) / 20) + 1}页）`
    };
  } else if (inWordBookData) {
    // 存在于单词本
    checkResult.value = {
      exists: true,
      inSystem: false,
      inWordBook: true,
      data: inWordBookData,
      message: `单词 "${word}" 已在您的单词本中`
    };
  } else {
    // 不存在，可以添加
    checkResult.value = {
      exists: false,
      inSystem: false,
      inWordBook: false,
      message: `单词 "${word}" 可以添加到单词本`
    };
    newEntry.value.word = word;
    newEntry.value.phonetic = '';
    newEntry.value.translation = '';
  }

  isChecking.value = false;
};

// 添加到单词本
const addToWordBook = async () => {
  if (!newEntry.value.phonetic.trim() || !newEntry.value.translation.trim()) {
    alert('请填写完整的音标和汉译');
    return;
  }

  const result = await storageManager.addToWordBook({
    word: newEntry.value.word,
    phonetic: newEntry.value.phonetic,
    translation: newEntry.value.translation
  });

  if (result.success) {
    alert('添加成功！');
    await loadWordBook();
    // 重置表单
    searchWord.value = '';
    newEntry.value = { word: '', phonetic: '', translation: '' };
    checkResult.value = null;
  } else {
    alert(result.message);
  }
};

// 删除单词
const removeWord = async (word: string) => {
  if (!confirm(`确定从单词本删除 "${word}" 吗？`)) return;

  const success = await storageManager.removeFromWordBook(word);
  if (success) {
    await loadWordBook();
  }
};

// 开始编辑
const startEdit = (entry: WordBookEntry) => {
  editingWord.value = entry.word;
  editForm.value.phonetic = entry.phonetic;
  editForm.value.translation = entry.translation;
};

// 保存编辑
const saveEdit = async () => {
  if (!editingWord.value) return;

  const success = await storageManager.updateWordBookEntry(editingWord.value, {
    phonetic: editForm.value.phonetic,
    translation: editForm.value.translation
  });

  if (success) {
    editingWord.value = null;
    await loadWordBook();
  }
};

// 取消编辑
const cancelEdit = () => {
  editingWord.value = null;
};

// 导出单词本
const exportWordBook = async () => {
  const { json, count, filename } = await storageManager.exportWordBook();

  if (count === 0) {
    alert('单词本为空，无需导出');
    return;
  }

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert(`成功导出 ${count} 个单词`);
};

// 格式化日期
const formatDate = (isoString: string) => {
  return isoString.split('T')[0];
};
</script>

<template>
  <div class="word-book-container">
    <h2>📓 单词本</h2>
    <p class="subtitle">随时添加新单词，建立您的专属词库</p>

    <!-- 添加单词区域 -->
    <div class="add-section">
      <h3>添加新单词</h3>
      <div class="search-box">
        <input
            v-model="searchWord"
            placeholder="输入要添加的单词..."
            class="word-input"
            @keyup.enter="checkWord"
        />
        <button @click="checkWord" class="check-btn" :disabled="isChecking">
          {{ isChecking ? '检查中...' : '检查是否存在' }}
        </button>
      </div>

      <!-- 检查结果展示 -->
      <div v-if="checkResult" class="result-panel" :class="{ 'exists': checkResult.exists }">
        <div class="result-icon">
          {{ checkResult.exists ? '⚠️' : '✅' }}
        </div>
        <div class="result-content">
          <p class="result-message">{{ checkResult.message }}</p>

          <!-- 如果存在于系统或单词本，显示详情 -->
          <div v-if="checkResult.exists && checkResult.data" class="existing-info">
            <table class="info-table">
              <tr>
                <td>单词</td>
                <td>{{ checkResult.data.word || checkResult.data.单词 }}</td>
              </tr>
              <tr>
                <td>音标</td>
                <td>{{ checkResult.data.phonetic || checkResult.data.音标 }}</td>
              </tr>
              <tr>
                <td>汉译</td>
                <td>{{ checkResult.data.translation || checkResult.data.汉译 }}</td>
              </tr>
              <tr v-if="checkResult.data.考察次数">
                <td>考察次数</td>
                <td><span class="count-badge">{{ checkResult.data.考察次数 }}</span></td>
              </tr>
              <tr v-if="checkResult.inWordBook">
                <td>添加日期</td>
                <td>{{ formatDate(checkResult.data.addedAt) }}</td>
              </tr>
            </table>
          </div>

          <!-- 如果不存在，显示录入表单 -->
          <div v-if="!checkResult.exists" class="entry-form">
            <div class="form-row">
              <label>单词</label>
              <input v-model="newEntry.word" disabled class="disabled-input" />
            </div>
            <div class="form-row">
              <label>音标 <span class="required">*</span></label>
              <input v-model="newEntry.phonetic" placeholder="如: aɪˈdiːəl" class="form-input" />
            </div>
            <div class="form-row">
              <label>汉译 <span class="required">*</span></label>
              <input v-model="newEntry.translation" placeholder="如: adj. 理想的 n. 理想" class="form-input" />
            </div>
            <button @click="addToWordBook" class="add-btn">添加到单词本</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 单词本列表 -->
    <div class="list-section">
      <div class="list-header">
        <h3>我的单词本 <span class="count">({{ wordBookList.length }} 个单词)</span></h3>
        <div class="actions">
          <span class="storage-hint">存储: {{ storageType }}</span>
          <button @click="exportWordBook" class="export-btn" :disabled="wordBookList.length === 0">
            📥 导出单词本
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="loading">加载中...</div>

      <div v-else-if="wordBookList.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>单词本还是空的</p>
        <p class="hint">在上方添加您的第一个单词吧！</p>
      </div>

      <table v-else class="word-table">
        <thead>
        <tr>
          <td>单词</td>
          <td>音标</td>
          <td>汉译</td>
          <td>添加日期</td>
          <td>操作</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="entry in wordBookList" :key="entry.word">
          <!-- 编辑模式 -->
          <template v-if="editingWord === entry.word">
            <td class="word-cell">{{ entry.word }}</td>
            <td><input v-model="editForm.phonetic" class="edit-input" /></td>
            <td><input v-model="editForm.translation" class="edit-input" /></td>
            <td>{{ formatDate(entry.addedAt) }}</td>
            <td class="actions-cell">
              <button @click="saveEdit" class="save-btn">保存</button>
              <button @click="cancelEdit" class="cancel-btn">取消</button>
            </td>
          </template>

          <!-- 显示模式 -->
          <template v-else>
            <td class="word-cell">{{ entry.word }}</td>
            <td class="phonetic">{{ entry.phonetic }}</td>
            <td class="translation">{{ entry.translation }}</td>
            <td class="date">{{ formatDate(entry.addedAt) }}</td>
            <td class="actions-cell">
              <button @click="startEdit(entry)" class="edit-btn">编辑</button>
              <button @click="removeWord(entry.word)" class="delete-btn">删除</button>
            </td>
          </template>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.word-book-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #111827;
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 30px;
}

/* 添加区域 */
.add-section {
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  border: 2px solid #86efac;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
}

.add-section h3 {
  margin-top: 0;
  color: #166534;
  font-size: 18px;
}

.search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.word-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #22c55e;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;
}

.word-input:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.check-btn {
  padding: 12px 24px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.check-btn:hover:not(:disabled) {
  background: #16a34a;
  transform: translateY(-1px);
}

.check-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 结果面板 */
.result-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  border: 2px solid #86efac;
}

.result-panel.exists {
  border-color: #fca5a5;
  background: #fef2f2;
}

.result-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
}

.result-message {
  font-weight: 600;
  color: #166534;
  margin-bottom: 16px;
}

.exists .result-message {
  color: #991b1b;
}

/* 已存在信息表格 */
.info-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.info-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
}

.info-table td:first-child {
  width: 100px;
  color: #6b7280;
  font-weight: 500;
  background: #f9fafb;
}

.info-table tr:last-child td {
  border-bottom: none;
}

.count-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

/* 录入表单 */
.entry-form {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.form-row {
  margin-bottom: 16px;
}

.form-row label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #dc2626;
}

.form-input, .disabled-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.disabled-input {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.add-btn {
  width: 100%;
  padding: 12px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #16a34a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* 列表区域 */
.list-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.list-header h3 {
  margin: 0;
  color: #111827;
}

.list-header .count {
  color: #6b7280;
  font-weight: normal;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.storage-hint {
  color: #6b7280;
  font-size: 12px;
  padding: 4px 8px;
  background: #f3f4f6;
  border-radius: 4px;
}

.export-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.hint {
  font-size: 14px;
  margin-top: 8px;
}

/* 表格 */
.word-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.word-table thead {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.word-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.word-table tbody tr:hover {
  background: #f9fafb;
}

.word-cell {
  font-weight: 600;
  color: #111827;
}

.phonetic {
  color: #6b7280;
  font-style: italic;
  font-family: 'Times New Roman', serif;
}

.translation {
  color: #374151;
  max-width: 300px;
  word-wrap: break-word;
}

.date {
  color: #9ca3af;
  font-size: 13px;
  white-space: nowrap;
}

/* 操作按钮 */
.actions-cell {
  white-space: nowrap;
}

.actions-cell button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 6px;
  transition: all 0.2s;
}

.edit-btn {
  background: #dbeafe;
  color: #1e40af;
}

.edit-btn:hover {
  background: #bfdbfe;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fecaca;
}

.save-btn {
  background: #22c55e;
  color: white;
}

.cancel-btn {
  background: #f3f4f6;
  color: #6b7280;
  margin-left: 4px;
}

.edit-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}
</style>